import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { createLocation, deleteLocation, getLocation, getLocations, updateLocation } from "../db";


export const locationSchema = Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
    locationname: Joi.string().required()
})
export const updatelocationSchema = Joi.object({
    id:Joi.number().required(),
    longitude: Joi.string().optional(),
    latitude: Joi.string().optional(),
    locationname: Joi.string().optional()
})

export const getSchema = Joi.object({
    id: Joi.number().required()
})







export async function postLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = locationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }

        let {
            latitude,
            longitude,
            locationname
        } = value;


        const location = await createLocation({
            latitude,
            longitude,
            locationname
        })



        return res.status(201).json({
            status:"message",
            data:location
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}
export async function patchLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = updatelocationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }

        let {
            id,
            latitude,
            longitude,
            locationname
        } = value;


        const location = await updateLocation({
            latitude,
            longitude,
            locationname
        }, id)



        return res.status(201).json({
            status:"message",
            data:location
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}



export async  function retrievelocations(req: express.Request, res: express.Response, next: express.NextFunction){
    try {

        const locations = await getLocations()



        return res.status(200).json({
            status:"message",
            data:locations
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async  function retrievelocation(req: express.Request, res: express.Response, next: express.NextFunction){
    try {

        const { error, value } = getSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }

        let {id} = value

        const location = await getLocation(id)



        return res.status(200).json({
            status:"message",
            data:location
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async  function removelocation(req: express.Request, res: express.Response, next: express.NextFunction){
    try {

        const { error, value } = getSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }

        let {id} = value

        await deleteLocation(id)

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
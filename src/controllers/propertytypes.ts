import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { createpropertytypes, deletepropertytypes,   getpropertytype,  getpropertytypes,  updatepropertytypes } from "../db";


export const propertytypeschema = Joi.object({
    name: Joi.string().required()
})
export const updatepropertytypeschema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().optional(),
})


export const getSchema = Joi.object({
    id: Joi.number().required()
})





export async function postPropertyType(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = propertytypeschema.validate(req.body, { abortEarly: false });

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

            name
        } = value;


        const propertytype = await createpropertytypes({
            name
        })



        return res.status(201).json({
            status: "message",
            data: propertytype
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}
export async function patchpropertytypes(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = updatepropertytypeschema.validate(req.body, { abortEarly: false });

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
            name
        } = value;


        const propertytype = await updatepropertytypes({
            name
        }, id)



        return res.status(201).json({
            status: "message",
            data: propertytype
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}



export async function retrievePropertyTypes(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const propetytype = await getpropertytypes()



        return res.status(200).json({
            status: "message",
            data: propetytype
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function retrievePropertyType(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        let { id } = value

        const propertytype = await getpropertytype(id)



        return res.status(200).json({
            status: "message",
            data: propertytype
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function removepropertytypes(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        let { id } = value

        await deletepropertytypes(id)

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
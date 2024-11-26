import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { createpropertyfeatures,  deletebulkpropertyfeatures,  deletepropertyfeatures,  getpropertyfeature, getpropertyfeatures,  updatepropertyfeatures } from "../db";


export const featureSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
})
export const updatefeatureSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    description: Joi.string().optional()
})


export const getSchema = Joi.object({
    id: Joi.number().required()
})

export const deleteSchema = Joi.object({
    features:Joi.array().required()
})







export async function postFeature(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = featureSchema.validate(req.body, { abortEarly: false });

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

            name,
            description
        } = value;


        const feature = await createpropertyfeatures({
            name, description
        })



        return res.status(201).json({
            status: "message",
            data: feature
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}
export async function patchFeature(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = updatefeatureSchema.validate(req.body, { abortEarly: false });

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
            name, description
        } = value;


        const feature = await updatepropertyfeatures({
            name, description
        }, id)



        return res.status(201).json({
            status: "message",
            data: feature
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}



export async function retrievefeatures(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const features = await getpropertyfeatures()



        return res.status(200).json({
            status: "message",
            data: features
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function retrievefeature(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        const feature = await getpropertyfeature(id)



        return res.status(200).json({
            status: "message",
            data: feature
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function removefeature(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        await deletepropertyfeatures(id)

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
export async function removefeatures(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = deleteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }

        let { features } = value

        await deletebulkpropertyfeatures(features)

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
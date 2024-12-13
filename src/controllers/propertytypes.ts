import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";


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


        const propertytype = await prisma.propertyType.create({
            data: {
                name
            }

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


        const propertytype = await prisma.propertyType.update({
            where: {
                id
            },
            data: {
                name
            }

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



export async function retrievePropertyTypes(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const propetytype = await prisma.propertyType.findMany()



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

        const propertytype = await prisma.propertyType.findUniqueOrThrow({
            where:{
                id
            }
        })



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

        await prisma.propertyType.delete({
            where:{
                id
            }
        })

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
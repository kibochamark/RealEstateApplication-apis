import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";


export const accesschema = Joi.object({
    email:Joi.string().email()
})
export const updateaccessschema = Joi.object({
    id: Joi.number().required(),
    status: Joi.string().valid("PENDING", "APPROVED", "REJECTED") // Use .valid instead of .allow
})


export const getSchema = Joi.object({
    id: Joi.number().required()
})






export async function postAccessSchema(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = accesschema.validate(req.body, { abortEarly: false });

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

            email
        } = value;


        const access = await prisma.requestAccess.create({
            data: {
                email
            }

        })



        return res.status(201).json({
            status: "message",
            data: access
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}
export async function patchAccessSchema(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = updateaccessschema.validate(req.body, { abortEarly: false });

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
            status
        } = value;


        const accessupdate = await prisma.requestAccess.update({
            where: {
                id
            },
            data: {
                status
            }

        })



        return res.status(201).json({
            status: "message",
            data: accessupdate
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}



export async function retrieveAccessUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const accessusers = await prisma.requestAccess.findMany()



        return res.status(200).json({
            status: "message",
            data: accessusers
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function retrieveAccessUser(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        const accessuser = await prisma.requestAccess.findUniqueOrThrow({
            where:{
                id
            }
        })



        return res.status(200).json({
            status: "message",
            data: accessuser
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}




export async function removeAccessUser(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        await prisma.requestAccess.delete({
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
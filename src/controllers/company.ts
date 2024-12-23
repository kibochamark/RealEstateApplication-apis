import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";


export const companySchema = Joi.object({
    company_name: Joi.string().required(),
    street_address: Joi.string().required(),
    street_address2: Joi.string().required(),
    city: Joi.string().required(),
    area: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    county: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    phone: Joi.string().required(),
    phone2: Joi.string().optional(),
    email: Joi.string().required()
})
export const updatecompanySchema = Joi.object({
    id: Joi.number().required(),
    company_name: Joi.string().optional(),
    street_address: Joi.string().optional(),
    street_address2: Joi.string().optional(),
    city: Joi.string().optional(),
    area: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    county: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),

    phone: Joi.string().optional(),
    phone2: Joi.string().optional(),
    email: Joi.string().optional()
}).min(1)

export const getSchema = Joi.object({
    id: Joi.number().required()
})







export async function postCompany(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = companySchema.validate(req.body, { abortEarly: false });

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
            company_name,
            street_address,
            street_address2,

            city,
            area,
            state,
            country,
            county,
            latitude,
            longitude,
            phone,
            phone2,
            email,
        } = value;


        const company = await prisma.company.create({
            data: {
                companyName: company_name,
                streetAddress: street_address,
                streetAddress2: street_address2,
                city,
                area,
                state,
                country,
                county,
                latitude,
                longitude,
                phone,
                phone2,
                email,
            }

        })



        return res.status(201).json({
            status: "message",
            data: company
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}
export async function patchCompany(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const { error, value } = updatecompanySchema.validate(req.body, { abortEarly: false });

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
            company_name,
            street_address,
            street_address2,

            city,
            area,
            state,
            country,
            county,
            latitude,
            longitude,
            phone,
            phone2,
            email,
        } = value;


        const company = await prisma.company.update({
            where: {
                id
            },
            data: {
                companyName: company_name,
                streetAddress: street_address,
                streetAddress2: street_address2,
                city,
                area,
                state,
                country,
                county,
                latitude,
                longitude,
                phone,
                phone2,
                email,
            }

        })



        return res.status(201).json({
            status: "message",
            data: company
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }


}



export async function retrievecompanies(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const companies = await prisma.company.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })


        return res.status(200).json({
            status: "message",
            data: companies
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function retrievecompany(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        const company = await prisma.company.findUnique({
            where:{
                id
            }
        })



        return res.status(200).json({
            status: "message",
            data: company
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function removecompany(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        await prisma.company.delete({
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
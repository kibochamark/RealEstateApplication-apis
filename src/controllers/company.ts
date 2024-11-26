import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { createCompany, createLocation, deleteCompany, deleteLocation, getCompanies, getCompany, getLocation, getLocations, updateCompany } from "../db";


export const companySchema = Joi.object({
    company_name: Joi.string().required(),
    street_address: Joi.string().required(),
    street_address2: Joi.string().required(),
    location: Joi.number().required(),
    phone: Joi.string().required(),
    phone2: Joi.string().optional(),
    email: Joi.string().required()
})
export const updatecompanySchema = Joi.object({
    id:Joi.number().required(),
    company_name: Joi.string().optional(),
    street_address: Joi.string().optional(),
    street_address2: Joi.string().optional(),
    location: Joi.string().optional(),
    phone: Joi.string().optional(),
    phone2: Joi.string().optional(),
    email: Joi.string().optional()
})

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
            location,
            phone,
            phone2,
            email,
        } = value;


        const company = await createCompany({
            company_name,
            street_address,
            street_address2,
            location,
            phone,
            phone2,
            email,
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
            location,
            phone,
            phone2,
            email,
        } = value;


        const company = await updateCompany({
            company_name,
            street_address,
            street_address2,
            location,
            phone,
            phone2,
            email,
        }, id)



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

        const companies = await getCompanies()



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

        const company = await getCompany(id)



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

        await deleteCompany(id)

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
import express from "express"
import { GlobalError } from "../../types/errorTypes"
import Joi, { optional } from "joi";
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { createProperty, deleteproperty, getproperties, getProperty, updateProperty } from "../db";




// validation schema
const propertySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.number().integer().positive().required(),
    street_address: Joi.string().required(),
    city: Joi.string().optional(),
    saleType: Joi.string().valid('Sale', 'Rent', 'Lease').default('Sale'), // Replace with actual enums in `propertySaleType`
    featured: Joi.boolean().optional(),
    propertyType: Joi.number().integer().positive().required(),
    size: Joi.string().required(),
    distance: Joi.string().required(),
    price: Joi.number().precision(2).min(0).default(0.00),
    pricepermonth: Joi.number().precision(2).min(0).default(0.00),
    features: Joi.string().required(),
    state:Joi.string().required(),
    country:Joi.string().required(),
    area:Joi.string().required(),
    bedrooms:Joi.number().min(0).default(0),
});

const updatepropertySchema = Joi.object({
    id:Joi.number().required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    location: Joi.number().integer().positive().optional(),
    street_address: Joi.string().optional(),
    city: Joi.string().optional(),
    saleType: Joi.string().valid('Sale', 'Rent', 'Lease').default('Sale').optional(), // Replace with actual enums in `propertySaleType`
    featured: Joi.boolean().optional(),
    propertyType: Joi.number().integer().positive().optional(),
    size: Joi.string().optional(),
    distance: Joi.string().optional(),
    price: Joi.number().precision(2).min(0).default(0.00).optional(),
    pricepermonth: Joi.number().precision(2).min(0).default(0.00).optional(),
    features: Joi.string().optional(),
    state:Joi.string().optional(),
    country:Joi.string().optional(),
    area:Joi.string().optional(),
    bedrooms:Joi.number().min(0).default(0).optional(),
});


const GetSchema = Joi.object({
    id:Joi.number().required()
})





export async function postProperty(req: express.Request, res: express.Response, next: express.NextFunction) {


    try {




        const { error, value } = propertySchema.validate(req.body, { abortEarly: false });

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
            location,
            street_address,
            city,
            saleType,
            description,
            featured,
            propertyType,
            size,
            distance,
            price,
            features,
            state,
            country,
            area,
            bedrooms,
            pricepermonth
        } = value;
        // convert features to an array

        features = features.split(",")



        // array to store one or more image entries for our property
        let imageEntries: string[] = []


        // Process images if they exist
        if (req.files) {
            const files = req.files as Express.Multer.File[];

            const uploadPromises: Promise<UploadApiResponse>[] = files.map(file => cloudinary.uploader.upload(file.path));

            const uploadResults = await Promise.all(uploadPromises);

            imageEntries = uploadResults.map(result => {
                return result.secure_url
            });
        }





        // perform data manipulation in the db
        const newproperty = await createProperty({
            name,
            location,
            street_address,
            city,
            saleType,
            featured,
            propertyType,
            size,
            distance,
            price,
            description,
            state,
            country,
            area,
            bedrooms,
            pricepermonth
        }, imageEntries as string[], features)


        return res.status(201).json({
            status: "success",
            data: newproperty
        }).end()





    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
export async function putProperty(req: express.Request, res: express.Response, next: express.NextFunction) {


    try {

        console.log(req.body)



        const { error, value } = updatepropertySchema.validate(req.body, { abortEarly: false });

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
            name,
            location,
            street_address,
            city,
            saleType,
            description,
            featured,
            propertyType,
            size,
            distance,
            price,
            features,
            state,
            country,
            area,
            bedrooms,
            pricepermonth
        } = value;
        // convert features to an array

        features = features.split(",")



        // array to store one or more image entries for our property
        let imageEntries: string[] = []


        // Process images if they exist
        if (req.files) {
            const files = req.files as Express.Multer.File[];

            const uploadPromises: Promise<UploadApiResponse>[] = files.map(file => cloudinary.uploader.upload(file.path));

            const uploadResults = await Promise.all(uploadPromises);

            imageEntries = uploadResults.map(result => {
                return result.secure_url
            });
        }





        // perform data manipulation in the db
        const newproperty = await updateProperty({
            name,
            location,
            street_address,
            city,
            saleType,
            featured,
            propertyType,
            size,
            distance,
            price,
            description,
            state,
            country,
            area,
            bedrooms,
            pricepermonth
        }, imageEntries as string[], features, id)


        return res.status(201).json({
            status: "success",
            data: newproperty
        }).end()





    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}




export async function getProperties(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {

        const properties = await getproperties()

        return res.status(200).json({
            status: "success",
            data: properties
        }).end()

    } catch (e: any) {

        let error = new GlobalError(`${e.message}`, 500, "fail")
        error.statusCode = 500
        error.status = "server error"
        next(error)
    }
}

export async function getPropertyById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {

        const { error, value } = GetSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }


        const {id} = value

        const existingproperty = await getProperty(id)

        return res.status(200).json({
            status: "success",
            data: existingproperty
        }).end()

    } catch (e: any) {

        let error = new GlobalError(`${e.message}`, 500, "fail")
        error.statusCode = 500
        error.status = "server error"
        next(error)
    }
}


export async function  deletePropertyById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {

        const { error, value } = GetSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }


        const {id} = value

        await  deleteproperty(id)

        return res.status(204).json().end()

    } catch (e: any) {

        let error = new GlobalError(`${e.message}`, 500, "fail")
        error.statusCode = 500
        error.status = "server error"
        next(error)
    }
}
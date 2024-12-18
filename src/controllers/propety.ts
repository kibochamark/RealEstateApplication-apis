import express from "express"
import { GlobalError } from "../../types/errorTypes"
import Joi from "joi";
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { deleteFile } from "../utils/upload";
import { prisma } from "../utils/prismaconnection";
import { off } from "process";





// validation schema
const propertySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    city: Joi.string().required(),
    area: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    county: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    street_address: Joi.string().required(),
    saleType: Joi.string().valid('Sale', 'Rent', 'Lease').default('Sale'), // Replace with actual enums in `propertySaleType`
    featured: Joi.boolean().optional(),
    propertyType: Joi.number().integer().positive().required(),
    size: Joi.string().required(),
    distance: Joi.string().required(),
    price: Joi.number().precision(2).min(0).default(0.00),
    pricepermonth: Joi.number().precision(2).min(0).default(0.00),
    features: Joi.string().required(),
    bedrooms: Joi.number().min(0).default(0),
});

const updatepropertySchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),


    county: Joi.string().optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),

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
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    area: Joi.string().optional(),
    bedrooms: Joi.number().min(0).default(0).optional(),
}).min(2);


const GetSchema = Joi.object({
    id: Joi.number().required()
})


const updatePropertyImageSchema = Joi.object({
    publicId: Joi.string().optional(),
    action: Joi.string().allow("delete", "new").required(),
    propertyId: Joi.number().optional()
})





export async function postProperty(req: express.Request, res: express.Response, next: express.NextFunction) {


    try {




        const { error, value } = propertySchema.validate(JSON.parse(req.body.json), { abortEarly: false });

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
            county,
            latitude,
            longitude,
            country,
            area,
            bedrooms,
            pricepermonth
        } = value;
        // convert features to an array

        console.log(features)
        console.log(features.split(","))

        features = features.split(",").map((feat: string) => parseInt(feat))

        console.log(features)





        // array to store one or more image entries for our property
        let imageEntries: { url: string; public_id: string; }[] = []


        // Process images if they exist
        if (req.files) {
            const files = req.files as Express.Multer.File[];

            const uploadPromises: Promise<UploadApiResponse>[] = files.map(file => cloudinary.uploader.upload(file.path));

            const uploadResults = await Promise.all(uploadPromises);

            imageEntries = uploadResults.map(result => {
                return {
                    url: result.secure_url,
                    public_id: result.public_id
                }
            });
        }






        // perform data manipulation in the db
        const [newproperty] = await prisma.$transaction(async (tx) => {
            const newproperty = await tx.property.create({
                data: {
                    name,
                    county,
                    latitude,
                    longitude,
                    streetAddress: street_address,
                    city,
                    saleType,
                    featured,
                    propertyTypeId: parseInt(propertyType),
                    size,
                    distance,
                    price,
                    description,
                    state,
                    country,
                    area,
                    bedrooms,
                    pricePerMonth: pricepermonth,
                    propertyToFeatures: features
                }
            })
            // if (!newproperty) {
            //     imageEntries.map((img) => {
            //         deleteFile(img.public_id)
            //     })
            // }

            let formattedimageEntries = imageEntries.map((img) => {
                return {
                    propertyId: newproperty.id,
                    publicId: img.public_id,
                    url: img.url
                }
            })
            // add images to our database
            await tx.propertyImage.createMany({
                data: formattedimageEntries
            })



            return [newproperty]
        })


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

        // console.log(req.body)



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
            county,
            latitude,
            longitude,
            country,
            area,
            bedrooms,
            pricepermonth
        } = value;
        // convert features to an array

        features = features.split(",")


        // perform data manipulation in the db
        const [updateproperty] = await prisma.$transaction(async (tx) => {
            const updateproperty = await tx.property.update({
                where: {
                    id
                },
                data: {
                    name,
                    county,
                    latitude,
                    longitude,
                    streetAddress: street_address,
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
                    pricePerMonth: pricepermonth,
                    propertyToFeatures: features
                }
            })


            return [updateproperty]
        })





        return res.status(201).json({
            status: "success",
            data: updateproperty
        }).end()





    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}



// update a property image
export async function updatePropertyImage(req: express.Request, res: express.Response, next: express.NextFunction) {


    try {




        const { error, value } = updatePropertyImageSchema.validate(req.body, { abortEarly: false });

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
            action,
            publicId,
            propertyId
        } = value;


        if (action == "delete") {
            deleteFile(publicId)
            const propertyimage = await prisma.propertyImage.findFirst({
                where: {
                    publicId
                }
            })
            await prisma.propertyImage.delete({
                where: {
                    id: propertyimage.id
                }
            })
        } else if (action == "new" && propertyId) {
            // array to store one or more image entries for our property
            let imageEntries: { url: string; publicId: string; propertyId: number; }[] = []


            // Process images if they exist
            if (req.files) {
                const files = req.files as Express.Multer.File[];

                const uploadPromises: Promise<UploadApiResponse>[] = files.map(file => cloudinary.uploader.upload(file.path));

                const uploadResults = await Promise.all(uploadPromises);

                imageEntries = uploadResults.map(result => {
                    return {
                        url: result.secure_url,
                        publicId: result.public_id,
                        propertyId
                    }
                });
            }


            await prisma.propertyImage.createMany({
                data: imageEntries
            })
        } else {
            return res.status(200).json({
                message: "No action was performed"
            })
        }





        return res.status(201).json({
            status: "success",
        }).end()





    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}






export async function getProperties(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {



        const { limit, page } = req.query

        // number of items to display per page
        const number_of_items = 20

        const offset = (parseInt(page as string) - 1) * number_of_items;



        const properties = await prisma.property.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    area: true,
                    city: true,
                    price: true,
                    pricePerMonth: true,
                    bedrooms: true,
                    size: true,
                    images: true,
                    country: true,
                    state: true,
                    saleType: true,
                    featured: true,
                    propertyType: true,
                    county: true,
                    distance: true
                },
                take: parseInt(limit as string) ?? 200,
                skip: offset
            }
        )

        const pagecount = Math.ceil(Number(properties.length / number_of_items))

        return res.status(200).json({
            status: "success",
            data: {
                properties,
                totalpages: pagecount
            }
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


        const { id } = value

        const existingproperty = await prisma.property.findUnique({
            where: {
                id
            },
            include: {
                propertyType: true,

            }
        })




        const propertyfeatures = await prisma.propertyFeature.findMany({
            where: {
                id: {
                    in: existingproperty.propertyToFeatures
                }
            }
        })
        const propertyimages = await prisma.propertyImage.findMany({
            where: {
                propertyId: existingproperty.id
            }
        })

        return res.status(200).json({
            status: "success",
            data: {
                property: {
                    ...existingproperty,
                    propertyToFeatures: propertyfeatures
                },
                images: propertyimages,

            }
        }).end()

    } catch (e: any) {

        let error = new GlobalError(`${e.message}`, 500, "fail")
        error.statusCode = 500
        error.status = "server error"
        next(error)
    }
}


export async function deletePropertyById(req: express.Request, res: express.Response, next: express.NextFunction) {

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


        const { id } = value


        await prisma.$transaction(async (tx) => {
            // retrieve property to delete
            const retrieveproperty = await tx.property.findUnique(
                {
                    where: {
                        id
                    }
                }
            )

            if (!retrieveproperty) {
                return next(new GlobalError("Property not found", 404, "fail"))
            }


            // retrieve the list of images to delete
            const propertyimages = await tx.propertyImage.findMany({
                where: {
                    propertyId: id
                }
            })

            if (!propertyimages) throw new Error("no images found")

            propertyimages.forEach((img) => {
                deleteFile(img.publicId)
            })

            // delete url from the db
            await tx.propertyImage.deleteMany({
                where: {
                    propertyId: id
                }
            })

            await tx.property.delete({
                where: {
                    id
                }
            })
        })


        return res.status(204).json().end()

    } catch (e: any) {

        let error = new GlobalError(`${e.message}`, 500, "fail")
        error.statusCode = 500
        error.status = "server error"
        next(error)
    }
}



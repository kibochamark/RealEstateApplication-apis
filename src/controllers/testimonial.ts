import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";
import { v2 as cloudinary } from "cloudinary";
import { deleteFile } from "../utils/upload";


// Validation schema
const testimonialSchema = Joi.object({
  name: Joi.string().required(),
  designation: Joi.string().required(),
  quote: Joi.string().required(),
  userId: Joi.number().required()
});

const updateTestimonialSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  designation: Joi.string().optional(),
  quote: Joi.string().optional(),
  userId: Joi.number(),
});

const getSchema = Joi.object({
  id: Joi.number().required(),
});

// Post a testimonial
export async function postTestimonial(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {

    // Validate the incoming request body
    const { error, value } = testimonialSchema.validate(JSON.parse(req.body.json), { abortEarly: false });
    if (error) {
      let statusError = new GlobalError(
        JSON.stringify({ error: error.details.map((detail) => detail.message) }),
        400,
        ""
      );
      statusError.status = "failed";
      next(statusError);
    }

    let { name, quote, userId, designation } = value;
    //check if testimonial exists
    // Check if a testimonial with the same name already exists
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { name },
    });

    if (existingTestimonial) {
      return next(
        new GlobalError("A testimonial with this name already exists", 400, "fail")
      );
    }

    // Fetch the user from the database
    const user = await prisma.intimeUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      next(new GlobalError("User does not exist", 400, "fail"))
    }

    // Initialize imageUrl and public_id variables
    let imageurldata = {
      url: "",
      public_id: "",
    };

    if (!req.file) {
      return next(new Error("No file uploaded"));
    }
    // Process images if they exist
    if (req.file) {
      try {
        const file = req.file as Express.Multer.File;

        const result = await cloudinary.uploader.upload(file.path);
        imageurldata.url = result.secure_url;
        imageurldata.public_id = result.public_id;
      } catch (e: any) {
        throw new Error(
          "something went wrong"
        )
      }

    }

    const postdata = {
      ...value,
      imageUrl: imageurldata.url,
      public_id: imageurldata.public_id,
    }

    const testimonial =await prisma.testimonial.create({
      data: {
        ...postdata
      }
    })
    // console.log(imageurldata)
    // Create the testimonial in the database
    // const testimonial = await prisma.testimonial.create({
    //   data: {
    //     name,
    //     imageUrl: imageurldata.url,
    //     public_id: imageurldata.public_id,
    //     quote:quote,
    //     userId:user.id
    //   },
    // });

    return res.status(201).json({
      status: "success",
      data:testimonial

    });
  } catch (e: any) {

    return res.status(400).json({
      error: e.message
    }).end()
  }
}
// Get testimonials
export async function getAllTestimonials(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // Fetch all testimonials
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select:{
            username:true
          }
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: testimonials,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}


///single testimonial
export async function getSingleTestimonial(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;  // Get the id from the route parameter

    // Validate ID if necessary (optional)
    if (!id || isNaN(parseInt(id, 10))) {
      let statusError = new GlobalError("Invalid ID", 400, "fail");
      return next(statusError);
    }

    // Fetch a single testimonial by ID
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: {
          select:{
            username:true
          }
        },  // Include related user data if necessary
      },
    });

    if (!testimonial) {
      let statusError = new GlobalError("Testimonial not found", 404, "fail");
      return next(statusError);
    }

    return res.status(200).json({
      status: "success",
      data: testimonial,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}



// Update a testimonial
export async function updateTestimonial(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
 
    const { error, value } = updateTestimonialSchema.validate(JSON.parse(req.body.json), {
      abortEarly: false,
    });
    if (error) {
      let statusError = new GlobalError(
        JSON.stringify({
          error: error.details.map((detail) => detail.message),
        }),
        400,
        ""
      );
      statusError.status = "failed";
      return next(statusError);
    }

    const { name, quote, userId, id, designation} = value


    // Initialize imageUrl and public_id variables
    let imageurldata = {
      url: "",
      public_id: "",
    };

     //check if testimonial exists
    // Check if a testimonial with the same name already exists
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { id },
    });

    
    // Process images if they exist
    if (req.file) {
      try {
        // delete existing image
        deleteFile(existingTestimonial.public_id)

        const file = req.file as Express.Multer.File;

        const result = await cloudinary.uploader.upload(file.path);
        imageurldata.url = result.secure_url;
        imageurldata.public_id = result.public_id;
      } catch (e: any) {
        throw new Error(
          "something went wrong"
        )
      }
    }

    // construct our update body
    let updatebody:{
      imageUrl?:string
      public_id?:string;
      name?:string;
      designation?:string;
      quote?:string;

    }={

    }

    if(req.file){
      updatebody["imageUrl"] = imageurldata.url
      updatebody["public_id"]= imageurldata.public_id
    }else if(quote){
      updatebody["quote"]=quote
    }else if(quote){
      updatebody["name"]=name
    }else if(quote){
      updatebody["quote"]=designation
    }


    const updatedtestimonial = await prisma.testimonial.update({
      where:{
        id
      },
      data:{
        ...updatebody
      }
    })


    return res.status(200).json({
      message:"success",
      data:updatedtestimonial
    })

  } catch (e) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}


//delete
export async function deleteTestimonial(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { id } = req.params;

    // Check if the testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!testimonial) {
      const error = new GlobalError(
        `Testimonial with ID ${id} not found.`,
        404,
        "fail"
      );
      return next(error);
    }

    // Delete the testimonial
    await prisma.testimonial.delete({
      where: { id: parseInt(id, 10) },
    });

    // delete image in cloud
    deleteFile(testimonial.public_id)

    res.status(200).json({
      status: "success",
      message: `Testimonial with ID ${id} has been deleted successfully.`,
    });
  } catch (e: any) {
    const error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

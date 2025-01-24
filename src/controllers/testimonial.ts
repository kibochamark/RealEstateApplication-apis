import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";


// Validation schema
const testimonialSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  userId: Joi.number().required()
});

const updateTestimonialSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  imageUrl: Joi.string().uri().optional(),
  description: Joi.string().optional(),
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

    let { name, description, userId, onBehalfOf, rating } = value;
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

    // Validate the incoming request body
    const { error, value } = testimonialSchema.validate(JSON.parse(req.body.json), { abortEarly: false });
    // if (error) {
    //   let statusError = new GlobalError(
    //     JSON.stringify({ error: error.details.map((detail) => detail.message) }),
    //     400,
    //     "fail"
    //   );
    //   next(statusError);
    // }

    let { name, description, userId} = value;

    // // Fetch the user from the database
    // const user = await prisma.intimeUser.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   next(new GlobalError("User does not exist", 400, "fail"))
    // }

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

    // console.log(imageurldata)
    // // Create the testimonial in the database
    // const testimonial = await prisma.testimonial.create({
    //   data: {
    //     name,
    //     imageUrl: imageurldata.url,
    //     public_id: imageurldata.public_id,
    //     description,
    //     userId,
    //     onBehalfOf,
    //     rating,
    //   },
    // });

    return res.status(201).json({
      status: "success",

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
        user: true,
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
        user: true,  // Include related user data if necessary
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
    const { id } = req.params;
    const { error, value } = updateTestimonialSchema.validate(req.body, {
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

    res.status(200).json({
      status: "success",
      message: `Testimonial with ID ${id} has been deleted successfully.`,
    });
  } catch (e: any) {
    const error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

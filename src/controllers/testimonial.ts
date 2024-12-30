import Joi from "joi";
import express from "express"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";


// Validation schema
const testimonialSchema = Joi.object({
  name: Joi.string().required(),
  imageUrl: Joi.string().uri().optional(),
  description: Joi.string().optional(),
  userId: Joi.number().required(),
  onBehalfOf: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
});

const updateTestimonialSchema = Joi.object({
  name: Joi.string(),
  imageUrl: Joi.string().uri().optional(),
  description: Joi.string().optional(),
  userId: Joi.number(),
  onBehalfOf: Joi.string(),
  rating: Joi.number().min(1).max(5),
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
    const { error, value } = testimonialSchema.validate(
      req.body,
      { abortEarly: false }
    );
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

    const { name, imageUrl, description, userId, onBehalfOf, rating } = value;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        imageUrl,
        description, 
        userId,
        onBehalfOf,
        rating,
      },
    });

    return res.status(201).json({
      status: "success",
      data: testimonial,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
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

    const updatedData = {
      ...value,
      description: value.description ? JSON.parse(value.description) : undefined,
    };

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    return res.status(200).json({
      status: "success",
      data: testimonial,
    });
  } catch (e: any) {
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
  
      res.status(200).json({
        status: "success",
        message: `Testimonial with ID ${id} has been deleted successfully.`,
      });
    } catch (e: any) {
      const error = new GlobalError(`${e.message}`, 500, "fail");
      return next(error);
    }
  }

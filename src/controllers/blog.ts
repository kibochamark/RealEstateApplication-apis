import Joi, { number } from "joi";
import express from "express";
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import { deleteFile } from "../utils/upload";

export const blogschema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  shortDescription: Joi.string().required(),
  userId: Joi.number().required(),
});
export const updateblogschema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  userId: Joi.number().required(),
});

export const getSchema = Joi.object({
  id: Joi.number().required(),
});

export async function postBlog(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { error, value } = blogschema.validate(JSON.parse(req.body.json), {
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
      statusError.status = "fail";
      return next(statusError);
    }

    let { name, description, shortDescription, userId } = value;

    const user = await prisma.intimeUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User does not exist");

    let imageurldata = {
      url: "",
      public_id: "",
    };
    // Process images if they exist
    if (req.file) {
      const file = req.file as Express.Multer.File;

      const result = await cloudinary.uploader.upload(file.path);
      imageurldata.url = result.secure_url;
      imageurldata.public_id = result.public_id;
    }

    const blog = await prisma.blog.create({
      data: {
        name,
        description,
        imageUrl: imageurldata.url,
        public_id: imageurldata.public_id,
        userId,
        shortDescription,
      },
    });

    return res.status(201).json({
      status: "message",
      data: blog,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}
export async function patchBlog(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { error, value } = updateblogschema.validate(JSON.parse(req.body.json), {
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
      statusError.status = "fail";
      return next(statusError);
    }

    let { id, name, description, shortDescription, userId } = value;

    const user = await prisma.intimeUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User does not exist");

    let imageurldata = {
      url: "",
      public_id: "",
    };
    // Process images if they exist
    if (req.file) {
      const file = req.file as Express.Multer.File;

      const result = await cloudinary.uploader.upload(file.path);
      imageurldata.url = result.secure_url;
      imageurldata.public_id = result.public_id;
    }

    const existingblog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingblog) {
      deleteFile(imageurldata.public_id);
      throw new Error("Blog does not exist");
    }

    if (Object.values(imageurldata).length > 0) {
      deleteFile(existingblog.public_id);
    }

    const blog = await prisma.blog.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        userId,
        imageUrl:
          imageurldata.url.length > 0
            ? imageurldata.url
            : existingblog.imageUrl,
        public_id:
          imageurldata.url.length > 0
            ? imageurldata.public_id
            : existingblog.public_id,
      },
    });

    return res.status(201).json({
      status: "message",
      data: blog,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

export async function retrieveblogs(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        user: {
            select:{
                firstname:true,
                lastname:true
            }
        },
      },
    });

    return res.status(200).json({
      status: "message",
      data: blogs,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

export async function retrieveBlog(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { error, value } = getSchema.validate(req.params, {
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
      statusError.status = "fail";
      return next(statusError);
    }

    let { id } = value;

    const blog = await prisma.blog.findUniqueOrThrow({
      where: {
        id,
      },

      include: {
        user: {
            select:{
                firstname:true,
                lastname:true,
            }
        },
      },
    });

    return res.status(200).json({
      status: "message",
      data: blog,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

export async function removeblog(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { error, value } = getSchema.validate(req.params, {
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
      statusError.status = "fail";
      return next(statusError);
    }

    let { id } = value;

    const existingblog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });

    if (!existingblog) throw new Error("blog not found");

    await prisma.$transaction(async (tx) => {
      deleteFile(existingblog.public_id);
      await tx.blog.delete({
        where: {
          id,
        },
      });
    });

    return res.status(204).json();
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

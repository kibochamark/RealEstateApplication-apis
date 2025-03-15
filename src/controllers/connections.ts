import Joi, { number } from "joi";
import express from "express";
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import { deleteFile } from "../utils/upload";

export const connectionchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  message: Joi.string().required(),
});
export const updateconnectionchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  message: Joi.string().required(),
  id: Joi.number().required(),
  
});

export const getSchema = Joi.object({
  id: Joi.number().required(),
});

export async function postConnection(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { error, value } = connectionchema.validate(JSON.parse(req.body), {
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

    let { name, email, phone, message } = value;

  


    const connection = await prisma.connections.create({
      data: {
        name,
        email,
        phone,
        message
      },
    });

    return res.status(201).json({
      status: "message",
      data: connection,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}
export async function patchConnection(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { error, value } = updateconnectionchema.validate(JSON.parse(req.body.json), {
      abortEarly: false,
    });
    console.log(req.body);
    

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

    let { id,  name, email, phone, message} = value;

    const connection= await prisma.connections.findUnique({
      where: {
        id,
      },
    });

    if (!connection) throw new Error("Record does not exist");

   

    const updateconection = await prisma.connections.update({
      where: {
        id,
      },
      data: {
        name,
       email,
       phone,
       message
      },
    });

    return res.status(201).json({
      status: "message",
      data: updateconection,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

export async function retrieveConnections(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const connections = await prisma.connections.findMany({
    });

    return res.status(200).json({
      status: "message",
      data: connections,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

export async function retrieveConnection(
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

    const connection = await prisma.connections.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "message",
      data: connection,
    });
  } catch (e: any) {
    let error = new GlobalError(`${e.message}`, 500, "fail");
    return next(error);
  }
}

export async function removeConnection(
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

    const existingconnection = await prisma.connections.findUnique({
      where: {
        id,
      },
    });

    if (!existingconnection) throw new Error("Record not found");

    await prisma.$transaction(async (tx) => {
      await tx.connections.delete({
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

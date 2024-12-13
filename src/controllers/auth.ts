import { Response, Request, NextFunction } from "express"
import Joi from "joi"
import { GlobalError } from "../../types/errorTypes";
import { prisma } from "../utils/prismaconnection";
import { checkPassword, createHash } from "utils/HashPassword";
import { generateTokens } from "../utils/jwtutils";


export const authSchema = Joi.object({
    companyId: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .pattern(
            new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        )
        .messages({
            'string.pattern.base':
                'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.',
        }),
    confimpassword: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            'any.only': 'Passwords do not match',
        }),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    contact: Joi.string().required(),
    username: Joi.string().required(),
}).with('password', 'confimpassword');

export const updateauthSchema = Joi.object({
    id: Joi.number().required(),
    companyId: Joi.number().required(),
    email: Joi.string().email().optional(),
    password: Joi.string()
        .optional()
        .pattern(
            new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        )
        .messages({
            'string.pattern.base':
                'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.',
        }),
    confimpassword: Joi.string()
        .optional()
        .valid(Joi.ref('password'))
        .messages({
            'any.only': 'Passwords do not match',
        }),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    contact: Joi.string().optional(),
    username: Joi.string().optional(),
}).min(1);


// Ensures both fields exist
export const loginauthSchema = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().required()
        .pattern(
            new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        )
        .messages({
            'string.pattern.base':
                'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.',
        }),

})// Ensures both fields exist


export const getSchema = Joi.object({
    id: Joi.number().required()
})





export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { error, value } = authSchema.validate(req.body, { abortEarly: false });

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
            username, email, password, contact, firstname, lastname, companyId
        } = value

        const { hashedPassword, salt } = await createHash(password)


        const newuser = await prisma.intimeUser.create({
            data: {
                username,
                password: hashedPassword,
                salt,
                firstname,
                lastname,
                email,
                contact,
                companyId
            }
        })

        if (!newuser) throw new GlobalError("failed to create user", 400, 'fail')

        return res.status(201).json({
            message: 'success',
            data: newuser
        })

    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}



export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { error, value } = authSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ), 400, "")
            statusError.status = "fail"
            return next(statusError)

        }

        const newuser = await prisma.intimeUser.findUnique({
            where: {
                email: value.email
            }
        })

        if (!newuser) throw new GlobalError("user not found", 404, 'fail')


        const ispasswordcorrect = await checkPassword(value.password, newuser.password)

        if (!ispasswordcorrect) throw new GlobalError("invalid credentials", 400, 'fail')

        // generate jwt token

        const tokens = generateTokens(newuser)


        return res.status(201).json({
            message: 'success',
            data: tokens
        })

    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}



export async function patchUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = updateauthSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new GlobalError(
                JSON.stringify({
                    error: error.details.map(detail => detail.message),
                }),
                400,
                ""
            );
            statusError.status = "fail";
            return next(statusError);
        }

        const {
            id,
            username,
            email,
            password,
            contact,
            firstname,
            lastname,
            companyId,
        } = value;

        // Dynamically construct data object
        const dataToUpdate: any = {};
        if (username) dataToUpdate.username = username;
        if (email) dataToUpdate.email = email;
        if (firstname) dataToUpdate.firstname = firstname;
        if (lastname) dataToUpdate.lastname = lastname;
        if (contact) dataToUpdate.contact = contact;
        if (companyId) dataToUpdate.companyId = companyId;

        if (password) {
            const { hashedPassword, salt } = await createHash(password);
            dataToUpdate.password = hashedPassword;
            dataToUpdate.salt = salt;
        }

        const updatedUser = await prisma.intimeUser.update({
            where: { id },
            data: dataToUpdate,
        });

        if (!updatedUser) {
            throw new GlobalError("Failed to update user", 400, "fail");
        }

        return res.status(201).json({
            status: "message",
            data: updatedUser,
        });
    } catch (e: any) {
        const error = new GlobalError(`${e.message}`, 500, "fail");
        return next(error);
    }
}




export async function retrieveusersbycompanyid(req: Request, res: Response, next: NextFunction) {
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

        const users = await prisma.intimeUser.findMany({
            where:{
                companyId:id
            }
        })


        return res.status(200).json({
            status: "message",
            data: users
        })


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}


export async function retrieveuser(req: Request, res: Response, next: NextFunction) {
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
            where: {
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


export async function removeuser(req: Request, res: Response, next: NextFunction) {
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

        await prisma.intimeUser.delete({
            where: {
                id
            }
        })

        return res.status(204).json()


    } catch (e: any) {
        let error = new GlobalError(`${e.message}`, 500, "fail")
        return next(error)
    }
}
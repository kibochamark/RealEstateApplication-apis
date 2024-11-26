// @ts-nocheck
import express from "express"
import cors from "cors"
import compression from "compression"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import session from 'express-session';


import http from "http"
import routes from "./router"
import dotenv from "dotenv"

import db from './utils/connection'

import { eq } from 'drizzle-orm';


dotenv.config()

const app = express(

)

app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());




app.use("/api/v1", routes)












// catch all routes that are not specified in the routes folder
app.use("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // create an error object
    const error: GlobalError = new Error(`cant find ${req.originalUrl} on the server`)
    error.status = "fail"
    error.statusCode = 404

    return next(error)
})




// create our global error stack
app.use((error: GlobalError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    error.statusCode = error?.statusCode || 500
    error.status = error.status || "error"

    return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    })
})





app.listen(8000, () => {
    console.log(`Server is running on port 8000`)
})


export default app
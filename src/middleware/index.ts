import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import express from 'express';
import { createUser, getUserByEmail, updateUser } from "../db";
import { GlobalError } from "../../types/errorTypes";

const client = jwksClient({
  jwksUri: "https://intimehomes.kinde.com/.well-known/jwks.json" as string // Ensure the environment variable is defined as a string
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, undefined);
    } else {
      const signingKey = key!.getPublicKey();
      callback(null, signingKey);
    }
  });
}

const authenticateJWT = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  

  if (authHeader) {
    console.log(authHeader, "auth")
    const token = authHeader.split(' ')[1];


    jwt.verify(token, getKey, {}, async (err, user: any) => {



      if (err != null) {
        return res.sendStatus(403);
      }



      const email = (user?.email) as string;
      const getuser = await getUserByEmail(email)
      console.log(getuser, "get")
      if (getuser.length <= 0) {
        try {
          const newuser = await createUser({ email: user?.email, kinde_id: user.sub ?? "", kinde_name: user.email, company_id: 1 })

        } catch (e) {
          let statusError =new GlobalError(e.message, 500, "")
          statusError.status = "fail"
          next(statusError)
        }
      }




      req.user = user as jwt.JwtPayload; // Type assertion to JwtPayload
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default authenticateJWT;






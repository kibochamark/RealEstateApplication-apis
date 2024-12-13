import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import { prisma } from "../utils/prismaconnection"

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

export default passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await prisma.intimeUser.findUnique({
        where: {
          email: payload.email
        },
        select:{
          username:true,
          email:true,
          company:{
            select:{
              companyName:true
            }
          },
          role:true
        }
      })

      if (!user) throw new Error("Not found");
      return done(null, user)
    } catch (error) {
      return done(error, null);
    }
  })
)
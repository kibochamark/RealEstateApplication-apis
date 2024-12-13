import passport from "passport"

import { Strategy } from "passport-local"
import { prisma } from "../../utils/prismaconnection"
import { checkPassword } from "../../utils/HashPassword"



passport.serializeUser((user: { email: string }, done) => {

    done(null, user?.email)
})


passport.deserializeUser(async (email, done) => {

    try {
        const user = await prisma.intimeUser.findUnique({
            where: {
                email: email as string
            },
            select: {
                username: true,
                email: true,
                role: true
            }
        })
        if (!user) throw new Error("user not found")
        done(null, user)
    }
    catch (e) {

        done(e, null)
    }

})


export default passport.use(
    new Strategy({ usernameField: "email" }, async (username, password, done) => {

        try {
            const user = await prisma.intimeUser.findUnique({
                where: {
                    email: username
                },
                select: {
                    email: true,
                    password: true
                }
            })

            if (!user) throw new Error("user not found")
            if (!checkPassword(password, user.password)) throw new Error("invalid credentials")

            return done(null, user)
        } catch (err) {
            done(err, null)
        }


    })
)
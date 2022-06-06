import { Router } from "express";
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import models from './model'
import bcrypt from 'bcrypt'
import { validateSession } from './session'

const router = Router()

router.post("/login", async (req: Request<ParamsDictionary, any, { email: string, password: string }>, res) => {

    try {
        const { email, password } = req.body

        const user = await models.user.findOne({ email })

        if (!user) return res.sendStatus(401)

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) return res.sendStatus(401)
        
        req.session.userId = user.id

        return res.sendStatus(200)


    } catch (error) {
        return res.sendStatus(500)
    }


})

router.get("/current_user", validateSession, async (req, res) => {

    try {  
        const user = await models.user.findById(req.session.userId)
        
        if (!user) {
            return res.sendStatus(404)
        }

        return res.status(200).json({ _id: user.id, email: user.email })

    } catch (error) {
        return res.sendStatus(500)
    }

})

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err)
    })

    res.clearCookie("sid", {
        secure: process.env.DEVELOPMENT ? false : true, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
    })

    return res.sendStatus(200)
})

//Called on tab reload to check session has associated userId
router.post("/validate_session", (req, res) => {
    return res.status(200).json({ session: !!req.session.userId })
})


export default router
import express from "express";
import AuthorModel from "../authors/schema.js";
import { generateJwt } from "../utils/auth/jwt.js";

const authRouter = express.Router();

authRouter.post('/login', async (req, res, next) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            const error = new Error("Missing credentials.")
            error.status = 400

            throw error
        }

        const user = await AuthorModel.findByCredentials(email, password)

        if (!user) {
            const error = new Error("No email/password match.")
            error.status = 400

            throw error
        }

        const token = await generateJwt({ id: user._id })

        res.status(200).send({ token })
    } catch (error) {
        next(error)
    }

})

authRouter.post("/register", async (req, res, next) => {
    try {
        const newUser = await new UserModel(req.body).save();
        delete newUser._doc.password

        const token = await generateJwt({ id: newUser._id })

        res.send({ newUser, token })
    } catch (error) {
        console.log({ error });
        res.send(500).send({ message: error.message });
    }
});

export default authRouter
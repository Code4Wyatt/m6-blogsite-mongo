import createHttpError from "http-errors"
import atob from "atob"
import UserModel from "../../src/services/users/schema.js"

const basicAuthMiddleware = async (req, res, next) => {
    // check in the headers the credentials
    // username : password

    console.log(req.headers)

    const encodedCredentials = req.headers.authorization.replace("Basic ", '')
    console.log(encodedCredentials)

    const [email, password] = atob(encodedCredentials).split(":")

    console.log({ email, password })

    const user = await UserModel.findByCredentials(email, password)

    req.user = user

    next()

}

export default basicAuthMiddleware
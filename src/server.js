import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import usersRouter from "./services/users/index.js"
import blogsRouter from "./services/blogs/index.js"
import {badRequestHandler, genericErrorHandler, notFoundHandler} from "../src/errorHandlers.js"

const server = express()

const port = process.env.PORT || 5001

// Middlewares //

server.use(cors())
server.use(express.json())

// Routes //

server.use("/users", usersRouter)
server.use("/blogs", blogsRouter)

// Error Handlers //

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB!")

    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server is running on port ${port}`)
    })
})

mongoose.connection.on("error", error => {
    console.log(error)
})

export default server;
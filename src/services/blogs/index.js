import express from "express"
import createHttpError from "http-errors"
import BlogModel from "./schema.js"

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
    try {
        const newBlog = new BlogModel(req.body);
        const { _id } = await newBlog.save();

        res.status(201).send({ _id });
    } catch (error) {
        console.log(error)
    }
});

blogsRouter.get("/", async (req, res, next) => {
    try {
        const allBlogs = await BlogModel.find();
        res.send(allBlogs)
    } catch (error) {
        console.log(error);
    }
})

export default blogsRouter
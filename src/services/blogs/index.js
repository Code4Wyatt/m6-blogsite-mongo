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

blogsRouter.put("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const editedBlog = await BlogModel.findByIdAndUpdate(blogId,req.body, { new: true });
        if (editedBlog) {
            res.send(editedBlog)
          } else {
            next(createHttpError(404, `Blog with id ${blogId} not found!`))
          }
    } catch (error) {
        console.log(error)
    }
})

blogsRouter.delete("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const deletedBlog = await BlogModel.findByIdAndDelete(blogId)
        if (deletedBlog) {
            res.status(204).send()
          } else {
            next(createHttpError(404, `Blog with id ${blogId} not found.`))
          }
    } catch (error) {
        console.log(error)
    }
})

export default blogsRouter
import express from "express"
import createHttpError from "http-errors"
import BlogModel from "./schema.js"

const blogsRouter = express.Router();

// Post Blog

blogsRouter.post("/", async (req, res, next) => {
    try {
        const newBlog = new BlogModel(req.body);
        const { _id } = await newBlog.save();
        res.status(201).send({ _id });
    } catch (error) {
        next(error)
    }
})

// Post Blog Comment

blogsRouter.post("/blogPosts/:id", async (req, res, next) => {
    try {
      const blogToComment = await BlogModel.findById(req.params.id);
      if(!blogToComment) {
          res.status(404).send({ message: `Blog with ${req.params.id} not found.`});
      } else {
          console.log(req.body)
          await BlogModel.findByIdAndUpdate(req.params.id,
            {
                $push: { comments: req.body,
                },
            },
            { new: true }
            )
            res.status(204).send();
      } 
      } catch (error) {
        console.log(error);
        next(error)
      }
})

// Get Blogs

blogsRouter.get("/", async (req, res, next) => {
    try {
        const allBlogs = await BlogModel.find()
        res.send(allBlogs)
    } catch (error) {
        next(error)
    }
})

// Get Blog Comments

blogsRouter.get("/blogPosts/:id/comments", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const commentedBlog = await BlogModel.findById(blogId)
        res.send(commentedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.get("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const singleBlog = await BlogModel.findById(blogId)
        res.send(singleBlog)
    } catch (error) {
        next(error)
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
        next(error)
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
        next(error)
    }
})

export default blogsRouter
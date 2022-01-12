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
       
        const blogToComment = await BlogModel.findById(req.body.blogId)
        
        if (blogToComment) {
            const commentToInsert = { ...blogToComment.toObject(), dateCommented: new Date() }
            console.log(commentToInsert)

            const updatedBlog = await BlogModel.findByIdAndUpdate(
                req.params.blogId,
                { $push: { comments: commentToInsert }},
                { new: true }
            )
            if (updatedBlog) {
                res.send(updatedBlog)
            } else {
                next(createHttpError(404, `Blog with id ${blogId} not found!`))
            }
        } else {
            next(createHttpError(404, `Blog with id ${blogId} not found!`))
        }
    } catch (error) {
        
    }
    
    
    // try {
    //     const blogId = req.params.id
    //     const blogToComment = await BlogModel.findById(blogId)
    //     if (blogToComment) {
    //         const newComment = { ...blogToComment.toObject(), date: new Date()}
    //         console.log(newComment)
    //         res.send(newComment)

    //         const updatedBlog = await BlogModel.findByIdAndUpdate(
    //             req.params.userId,
    //             { $push: { comment: newComment }},
    //             { new: true }
    //         )
    //         if (updatedBlog) {
    //             res.send(updatedBlog)
    //         } else {
    //             next(createHttpError(404, `Blog with id ${req.body._id} not found!`))
    //         }
    //     } else {
    //         next(createHttpError(404, `Blog with id ${req.body._id} not found!`))
    //     }
    // } catch (error) {
    //     next(error)
    // }
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
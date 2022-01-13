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
        next(error);
      }
})

// Get Blogs

blogsRouter.get("/", async (req, res, next) => {
    try {
        const allBlogs = await BlogModel.find() // .limit(2) to limit to 2 results for example
        res.send(allBlogs)
    } catch (error) {
        next(error)
    }
})

// Get Blog

blogsRouter.get("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const singleBlog = await BlogModel.findById(blogId)
        res.send(singleBlog)
    } catch (error) {
        next(error)
    }
})

// Get Blog Comments

blogsRouter.get("/blogPosts/:id/comments", async (req, res, next) => {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            res.status(404).send({ message: `Blog with ${req.params.id} not found.`});
        }
        res.send(blog.comments);
    } catch (error) {
        next(error)
    }
})

// Get Blog Comment 

blogsRouter.get("/blogPosts/:blogId/comments/:commentId", async (req, res, next) => {
    try {
        const blogPost = await BlogModel.findById(req.params.blogId)
        if (blogPost) {
            const selectedComment = blogPost.comments.find(comment => comment._id.toString() === req.params.commentId)
            if (selectedComment) {
                res.send(selectedComment)
            } else {
                next(createHttpError(404, `Comment with id ${req.params.commentId} not found.`))
            }
        } else {
            next(createHttpError(404, `Blog with id ${blogId} not found.`))
        }
    } catch (error) {
        next(error)
    }
})

// Edit Blog Comment

blogsRouter.put("/blogPosts/:blogId/comment/:commentId", async (req, res, next) => {
    try {
       const blogPost = await BlogModel.findById(req.params.blogId)
       if (blogPost) {
           const commentIndex = blogPost.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
           if (commentIndex !== -1) {
               const commentToEdit = { ...blogPost.comments[commentIndex].toObject(), ...req.body, updatedAt: new Date()}
               blogPost.comments[commentIndex] = commentToEdit
               await blogPost.save()
               res.send(blogPost)
           } else {
               next(createHttpError(404, `Comment with id ${req.params.commentId} not found`))
           }
       } else {
           next(createHttpError(404, `Blog with id ${blogId} not found`))
       }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

blogsRouter.put("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const editedBlog = await BlogModel.findByIdAndUpdate(blogId,req.body, { new: true })
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

// Delete Blog Comment

blogsRouter.delete("/blogPosts/:blogId/comment/:commentId", async (req, res, next) => {
    try {
        const deletedBlogComment = await BlogModel.findByIdAndUpdate(req.params.blogId, {$pull: { comments: { _id: req.params.commentId }}}, { new: true })
        if (deletedBlogComment) {
            res.send(deletedBlogComment)
        } else {
            next(createHttpError(404, `Blog with id ${req.params.blogId} not found`))
        }
    } catch (error) {
        next(error)
    }
})

export default blogsRouter
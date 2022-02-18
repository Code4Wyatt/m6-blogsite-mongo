"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const schema_js_1 = __importDefault(require("./schema.js"));
const blogsRouter = express_1.default.Router();
// Post Blog
blogsRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBlog = new schema_js_1.default(req.body);
        const { _id } = yield newBlog.save();
        res.status(201).send({ _id });
    }
    catch (error) {
        next(error);
    }
}));
// Post Blog Comment
blogsRouter.post("/blogPosts/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogToComment = yield schema_js_1.default.findById(req.params.id);
        if (!blogToComment) {
            res.status(404).send({ message: `Blog with ${req.params.id} not found.` });
        }
        else {
            console.log(req.body);
            yield schema_js_1.default.findByIdAndUpdate(req.params.id, {
                $push: { comments: req.body,
                },
            }, { new: true });
            res.status(204).send();
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
// Get Blogs
blogsRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBlogs = yield schema_js_1.default.find().populate({ path: "authors" }); // .limit(2) to limit to 2 results for example
        res.send(allBlogs);
    }
    catch (error) {
        next(error);
    }
}));
// Get Blog
blogsRouter.get("/:blogId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.blogId;
        const singleBlog = yield schema_js_1.default.findById(blogId).populate({ path: "authors" });
        if (singleBlog) {
            res.send(singleBlog);
        }
        else {
            next((0, http_errors_1.default)(404, `Blog post with id ${req.params.blogId} not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
// Get Blog Comments
blogsRouter.get("/blogPosts/:id/comments", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield schema_js_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).send({ message: `Blog with ${req.params.id} not found.` });
        }
        res.send(blog.comments);
    }
    catch (error) {
        next(error);
    }
}));
// Get Blog Comment 
blogsRouter.get("/blogPosts/:blogId/comments/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogPost = yield schema_js_1.default.findById(req.params.blogId);
        if (blogPost) {
            const selectedComment = blogPost.comments.find(comment => comment._id.toString() === req.params.commentId);
            if (selectedComment) {
                res.send(selectedComment);
            }
            else {
                next((0, http_errors_1.default)(404, `Comment with id ${req.params.commentId} not found.`));
            }
        }
        else {
            next((0, http_errors_1.default)(404, `Blog with id ${blogId} not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
// Edit Blog Comment
blogsRouter.put("/blogPosts/:blogId/comment/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogPost = yield schema_js_1.default.findById(req.params.blogId);
        if (blogPost) {
            const commentIndex = blogPost.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
            if (commentIndex !== -1) {
                const commentToEdit = Object.assign(Object.assign(Object.assign({}, blogPost.comments[commentIndex].toObject()), req.body), { updatedAt: new Date() });
                blogPost.comments[commentIndex] = commentToEdit;
                yield blogPost.save();
                res.send(blogPost);
            }
            else {
                next((0, http_errors_1.default)(404, `Comment with id ${req.params.commentId} not found`));
            }
        }
        else {
            next((0, http_errors_1.default)(404, `Blog with id ${blogId} not found`));
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
blogsRouter.put("/:blogId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.blogId;
        const editedBlog = yield schema_js_1.default.findByIdAndUpdate(blogId, req.body, { new: true });
        if (editedBlog) {
            res.send(editedBlog);
        }
        else {
            next((0, http_errors_1.default)(404, `Blog with id ${blogId} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
blogsRouter.delete("/:blogId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.blogId;
        const deletedBlog = yield schema_js_1.default.findByIdAndDelete(blogId);
        if (deletedBlog) {
            res.status(204).send();
        }
        else {
            next((0, http_errors_1.default)(404, `Blog with id ${blogId} not found.`));
        }
    }
    catch (error) {
        next(error);
    }
}));
// Delete Blog Comment
blogsRouter.delete("/blogPosts/:blogId/comment/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedBlogComment = yield schema_js_1.default.findByIdAndUpdate(req.params.blogId, { $pull: { comments: { _id: req.params.commentId } } }, { new: true });
        if (deletedBlogComment) {
            res.send(deletedBlogComment);
        }
        else {
            next((0, http_errors_1.default)(404, `Blog with id ${req.params.blogId} not found`));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = blogsRouter;

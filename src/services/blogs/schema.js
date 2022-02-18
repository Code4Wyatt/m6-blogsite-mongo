"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const CommentSchema = new Schema({
    comment: { type: String, required: true },
    user: {
        type: Object,
        name: { type: String, required: true },
        avatar: { type: String },
    },
}, { timestamps: true });
const blogSchema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        type: Object,
        required: true,
        nested: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
            },
        },
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: {
        type: String,
        required: true,
    },
    comments: { default: [], type: [CommentSchema] },
}, { timestamps: true });
exports.default = model("Blog", blogSchema);

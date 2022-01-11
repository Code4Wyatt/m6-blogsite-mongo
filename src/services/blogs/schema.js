import mongoose from "mongoose"

const { Schema, model } = mongoose

const blogSchema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: { type: Number, required: true},
    "author.name": { type: String, required: true},
    "author.avatar": { type: String, required: true},
},
{timestamps: true},
)

export default model("Blog", blogSchema)
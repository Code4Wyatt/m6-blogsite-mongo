import mongoose from "mongoose"

const { Schema, model } = mongoose

const CommentSchema = new Schema({
    comment: { type: String, required: true },
    user: { 
        name: { type: String},
        avatar: { type: String},
    },
},
{timestamps: true}
)

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
    author: { 
        type: Object, 
        required: true,
        nested: {
            name: {
                type: String, 
                required: true,
            },
            avatar: { 
                type: String, 
                required: true,
            },
        },
    },
    content: {
        type: String, 
        required: true,
    },
    comments: { default: [], type: [CommentSchema]},
},
{ timestamps: true },
)

export default model("Blog", blogSchema)
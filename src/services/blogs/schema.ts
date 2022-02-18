import mongoose from "mongoose"

const { Schema, model } = mongoose

const CommentSchema = new Schema<Comment>({
    comment: { type: String, required: true },
    user: { 
        type: Object,
        name: { type: String, required: true },
        avatar: { type: String },
    },
},
{timestamps: true},
)

const blogSchema = new Schema<Blog>({
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
    comments: { default: [], type: [CommentSchema]},
    
},
{ timestamps: true },
)

export default model("Blog", blogSchema)
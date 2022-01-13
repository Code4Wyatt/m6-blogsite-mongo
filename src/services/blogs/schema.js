import mongoose from "mongoose"

const { Schema, model } = mongoose

const CommentSchema = new Schema({
    comment: { type: String, required: true },
    user: { 
        type: Object,
        name: { type: String, required: true },
        avatar: { type: String },
    },
},
{timestamps: true},
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
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: {
        type: String, 
        required: true,
    },
    comments: { default: [], type: [CommentSchema]},
    
},
{ timestamps: true },
)

blogSchema.static("findBookWithAuthors", async function (query) {
    const total = await this.countDocuments(query.criteria)
    const books = await this.find(query.criteria).limit(query.options.limit || 10).skip(query.options.skip || 0).sort(query.options.sort).populate({ path: "authors", select: "firstName lastName" })

    return { total, books }
})

export default model("Blog", blogSchema)
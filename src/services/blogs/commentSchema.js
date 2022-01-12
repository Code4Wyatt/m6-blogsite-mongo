import mongoose from "mongoose"

const { Schema, model } = mongoose

const CommentSchema = new Schema({
    comments: { 
            default: [],
            type: [CommentSchema]
    },
},
{ timestamps: true },
)

export default CommentSchema
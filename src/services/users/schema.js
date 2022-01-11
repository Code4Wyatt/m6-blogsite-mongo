import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    topics_covered: [String],
},
    {
        timestamps: true,
    })

export default model("User", userSchema)
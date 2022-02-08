import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    password: { type: String, required: true },
    topics_covered: [String],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
    // before saving the user in the database, hash the password
    const newUser = this
    const plainPW = newUser.password

    if (newUser.isModified("password")) {
        const hash = await bcrypt.hash(plainPW, 10)
        newUser.password = hash
    }

    next()
})

UserSchema.methods.toJSON = function () {
    // called automatically every time express sends the users response res.send(users)
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    delete userObject.__v

    return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {
    const user = await this.findOne({ email }) // find the user by email, using this in a normal function to target the schema in this file

    if (user) {
        const isMatch = await bcrypt.compare(plainPW, user.password)
        if (isMatch) {
            return user
        } else {
            return null
        }
    } else {
        return null
    }
}

export default model("User", UserSchema)

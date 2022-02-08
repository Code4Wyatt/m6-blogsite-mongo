import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    topics_covered: [String],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
    // before saving the user in the database, hash the password and
    const newUser = this
    const plainPW = newUser.password

    if (newUser.isModified("password")) {
        const hash = await bcrpyt.hash(plainPW, 10)
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

export default model("User", UserSchema);

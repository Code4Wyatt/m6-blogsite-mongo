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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Schema, model } = mongoose_1.default;
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    password: { type: String, required: true },
    topics_covered: [String],
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // before saving the user in the database, hash the password
        const newUser = this;
        const plainPW = newUser.password;
        if (newUser.isModified("password")) {
            const hash = yield bcrypt_1.default.hash(plainPW, 10);
            newUser.password = hash;
        }
        next();
    });
});
UserSchema.methods.toJSON = function () {
    // called automatically every time express sends the users response res.send(users)
    const userDocument = this;
    const userObject = userDocument.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};
UserSchema.statics.checkCredentials = function (email, plainPW) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email }); // find the user by email, using this in a normal function to target the schema in this file
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(plainPW, user.password);
            if (isMatch) {
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
};
exports.default = model("User", UserSchema);

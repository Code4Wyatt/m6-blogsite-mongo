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
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const schema_js_1 = __importDefault(require("./schema.js"));
const index_js_1 = __importDefault(require("../blogs/index.js"));
const passport_1 = __importDefault(require("passport"));
const basic_js_1 = require("../../auth/basic.js");
const admin_js_1 = require("../../auth/admin.js");
const express_validator_1 = require("express-validator");
const token_js_1 = require("../../auth/token.js");
const tools_js_1 = require("../../auth/tools.js");
const usersRouter = express_1.default.Router();
usersRouter.get("/googleLogin", passport_1.default.authenticate("google", { scope: ["profile", "email"] })); // This endpoint receives Google Login requests from our FE, and it is going to redirect users to Google Consent Screen
usersRouter.get("/googleRedirect", // This endpoint URL should match EXACTLY the one configured on google.cloud dashboard
passport_1.default.authenticate("google"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("TOKENS: ", req.user.tokens);
        // SEND BACK TOKENS
        res.redirect(`${process.env.FE_URL}?accessToken=${req.user.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}`);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new schema_js_1.default(req.body);
        const { _id } = yield newUser.save();
        delete newUser._doc.password;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }
        const token = yield (0, tools_js_1.JWTAuthenticate)({ id: newUser._id });
        res.status(201).send({ _id, token });
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/", token_js_1.JWTAuthMiddleware, admin_js_1.adminOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield schema_js_1.default.find();
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/:userId", basic_js_1.basicAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield schema_js_1.default.findById(userId);
        if (user) {
            res.send(user);
        }
        else {
            next((0, http_errors_1.default)(404, `User with id ${userId} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
// Get User Stories
usersRouter.get("/me/posts", basic_js_1.basicAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const posts = yield index_js_1.default.find({ user: userId.toString() });
        res.status(200).send(posts);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put("/:userId", basic_js_1.basicAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const updatedUser = yield schema_js_1.default.findByIdAndUpdate(userId, req.body, {
            new: true,
        }); // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
        if (updatedUser) {
            res.send(updatedUser);
        }
        else {
            next((0, http_errors_1.default)(404, `User with id ${userId} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.delete("/:userId", basic_js_1.basicAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const deletedUser = yield schema_js_1.default.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(204).send();
        }
        else {
            next((0, http_errors_1.default)(404, `User with id ${userId} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body; // Get credentials from req.body
        const user = yield schema_js_1.default.checkCredentials(email, password); // Verify the credentials
        if (user) {
            // If credentials are fine we will generate a JWT token
            const accessToken = yield (0, tools_js_1.JWTAuthenticate)(user);
            res.status(200).send({ accessToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Invalid Credentials!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = usersRouter;

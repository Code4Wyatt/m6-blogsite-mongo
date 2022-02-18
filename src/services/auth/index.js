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
const index_js_1 = __importDefault(require("../users/index.js"));
const jwt_js_1 = require("../utils/auth/jwt.js");
const authRouter = express_1.default.Router();
authRouter.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error("Missing credentials.");
            error.status = 400;
            throw error;
        }
        const user = yield index_js_1.default.findByCredentials(email, password);
        if (!user) {
            const error = new Error("No email/password match.");
            error.status = 400;
            throw error;
        }
        const token = yield (0, jwt_js_1.generateJwt)({ id: user._id });
        res.status(200).send({ token });
    }
    catch (error) {
        next(error);
    }
}));
authRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield new index_js_1.default(req.body).save();
        delete newUser._doc.password;
        const token = yield (0, jwt_js_1.generateJwt)({ id: newUser._id });
        res.send({ newUser, token });
    }
    catch (error) {
        console.log({ error });
        res.send(500).send({ message: error.message });
    }
}));
exports.default = authRouter;

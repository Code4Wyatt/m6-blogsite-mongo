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
exports.verifyRefreshTokenAndGenerateNewTokens = exports.verifyJWT = exports.JWTAuthenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWTAuthenticate = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateJWTToken({
        _id: user._id,
        role: user.role,
    });
    return accessToken;
});
exports.JWTAuthenticate = JWTAuthenticate;
const generateJWTToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
}));
// USAGE: const token = await generateJWTToken({_id: "oaijsdjasdojasoidj"})
const verifyJWT = (token) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
        reject(err);
    else
        resolve(payload);
}));
exports.verifyJWT = verifyJWT;
const verifyRefreshToken = token => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.REFRESH_JWT_SECRET, (err, payload) => {
    if (err)
        reject(err);
    else
        resolve(payload);
}));
// USAGE: const payload = await verifyJWT(token)
const verifyRefreshTokenAndGenerateNewTokens = (currentRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Check the validity of the current refresh token (exp date and integrity)
        const payload = yield verifyRefreshToken(currentRefreshToken);
        // 2. If token is valid, we shall check if it is the same as the one saved in db
        const user = yield UsersModel.findById(payload._id);
        if (!user)
            throw new createHttpError(404, `User with id ${payload._id} not found!`);
        if (user.refreshToken && user.refreshToken === currentRefreshToken) {
            // 3. If everything is fine --> generate accessToken and refreshToken
            const { accessToken, refreshToken } = yield (0, exports.JWTAuthenticate)(user);
            // 4. Return tokens
            return { accessToken, refreshToken };
        }
        else {
            throw new createHttpError(401, "Refresh token not valid!");
        }
    }
    catch (error) {
        throw new createHttpError(401, "Refresh token expired or compromised!");
    }
});
exports.verifyRefreshTokenAndGenerateNewTokens = verifyRefreshTokenAndGenerateNewTokens;

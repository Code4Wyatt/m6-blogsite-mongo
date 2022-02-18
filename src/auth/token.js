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
exports.JWTAuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const tools_js_1 = require("./tools.js");
const JWTAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        // 1. Check if Authorization header is in the request, if it is not --> 401
        next((0, http_errors_1.default)(401, "Please provide bearer token in authorization header!"));
    }
    else {
        try {
            // 2. Extract token from header
            const token = req.headers.authorization.replace("Bearer ", ""); // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWMxZjllNTQxNTRjYzkxNTA4YzUzMDAiLCJyb2xlIjoiVXNlciIsImlhdCI6MTY0MDEwMjM3OCwiZXhwIjoxNjQwNzA3MTc4fQ.0zLoa3uLQeK0ZjtjE8VgqenvpVOmuy0LK9AXh3-sxTc
            // 3. Verify the token, if everything goes fine we should get back the payload of the token ({_id: "oio1ji2oi3", role: "User"})
            const payload = yield (0, tools_js_1.verifyJWT)(token);
            // 4. If token was ok we can go next
            req.user = {
                _id: payload._id,
                role: payload.role,
            };
            next();
        }
        catch (error) {
            // 5. In case of error thrown from jsonwebtoken library --> 401
            next((0, http_errors_1.default)(401, "Token not valid!"));
        }
    }
});
exports.JWTAuthMiddleware = JWTAuthMiddleware;

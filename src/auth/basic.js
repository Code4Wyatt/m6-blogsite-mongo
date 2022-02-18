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
exports.basicAuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const atob_1 = __importDefault(require("atob"));
const schema_js_1 = __importDefault(require("../../src/services/users/schema.js"));
const basicAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        next((0, http_errors_1.default)(401, "Please provide credentials in Authorization header!"));
    }
    else {
        const base64Credentials = req.headers.authorization.split(" ")[1];
        const decodedCredentials = (0, atob_1.default)(base64Credentials);
        const [email, password] = decodedCredentials.split(":");
        const user = yield schema_js_1.default.checkCredentials(email, password);
        if (user) {
            req.user = user;
            next();
        }
        else {
            next((0, http_errors_1.default)(401, "Credentials are not ok!"));
        }
    }
});
exports.basicAuthMiddleware = basicAuthMiddleware;

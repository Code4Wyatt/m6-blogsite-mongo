"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const index_js_1 = __importDefault(require("./services/users/index.js"));
const index_js_2 = __importDefault(require("./services/blogs/index.js"));
const index_js_3 = __importDefault(require("./services/authors/index.js"));
const oauth_js_1 = require("../src/auth/oauth.js");
const errorHandlers_js_1 = require("../src/errorHandlers.js");
const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL];
const corsOptions = {
    origin: function (origin, next) {
        console.log(origin);
        if (!origin || whiteList.indexOf(origin) !== -1) {
            next(null, true);
        }
        else {
            next(new Error("Not allowed by CORS"));
        }
    },
};
const server = (0, express_1.default)();
const port = process.env.PORT || 5001;
passport_1.default.use("google", oauth_js_1.googleStrategy);
// Middlewares //
server.use((0, cors_1.default)(corsOptions));
server.use(express_1.default.json());
server.use(passport_1.default.initialize());
// Routes //
server.use("/users", index_js_1.default);
server.use("/blogs", index_js_2.default);
server.use("/authors", index_js_3.default);
// Error Handlers //
server.use(errorHandlers_js_1.badRequestHandler);
server.use(errorHandlers_js_1.notFoundHandler);
server.use(errorHandlers_js_1.genericErrorHandler);
server.use(errorHandlers_js_1.forbiddenHandler);
server.use(errorHandlers_js_1.unauthorizedHandler);
mongoose_1.default.connect(process.env.MONGO_CONNECTION);
mongoose_1.default.connection.on("connected", () => {
    console.log("Connected to MongoDB!");
    server.listen(port, () => {
        console.table((0, express_list_endpoints_1.default)(server));
        console.log(`Server is running on port ${port}`);
    });
});
mongoose_1.default.connection.on("error", (error) => {
    console.log(error);
});
exports.default = server;

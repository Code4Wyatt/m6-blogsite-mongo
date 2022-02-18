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
exports.googleStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const schema_js_1 = __importDefault(require("../services/users/schema.js"));
const tools_js_1 = require("./tools.js");
exports.googleStrategy = new passport_google_oauth20_1.default({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleRedirect`,
}, (accessToken, refreshToken, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // this callback is executed when Google gives us a successfull response
        // here we are receiving some informations about the user from Google (profile, email)
        console.log("PROFILE: ", profile);
        // 1. Check if the user is already in our db
        const user = yield schema_js_1.default.findOne({ googleId: profile.id });
        if (user) {
            // 2. If the user is already there --> create some tokens for him/her
            const tokens = yield (0, tools_js_1.JWTAuthenticate)(user);
            // 3. Next
            passportNext(null, { tokens }); // passportNext attaches tokens to req.user --> req.user.tokens
        }
        else {
            // 4. If user is not in db --> add user to db and then create some tokens for him/her
            const newUser = new schema_js_1.default({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                googleId: profile.id,
            });
            const savedUser = yield newUser.save();
            const tokens = yield (0, tools_js_1.JWTAuthenticate)(savedUser);
            // 5. Next
            passportNext(null, { tokens });
        }
    }
    catch (error) {
        passportNext(error);
    }
}));
passport_1.default.serializeUser(function (data, passportNext) {
    // if you don't have this function, passport will trigerr a "failed to serialize" error
    passportNext(null, data);
});

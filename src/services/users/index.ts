import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./schema.js";
import BlogModel from "../blogs/index.js";
import passport from "passport";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { check, validationResult } from "express-validator";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { JWTAuthenticate, verifyRefreshTokenAndGenerateNewTokens } from "../../auth/tools.js";

const usersRouter = express.Router();


usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
) // This endpoint receives Google Login requests from our FE, and it is going to redirect users to Google Consent Screen

usersRouter.get(
  "/googleRedirect", // This endpoint URL should match EXACTLY the one configured on google.cloud dashboard
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log("TOKENS: ", req.user.tokens)
      // SEND BACK TOKENS
      res.redirect(
        `${process.env.FE_URL}?accessToken=${req.user.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}`
      )
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.post(
  "/register",
  async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();
      delete newUser._doc.password

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
        });
      }

      const token = await JWTAuthenticate({ id: newUser._id })
      res.status(201).send({ _id, token });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UsersModel.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await UsersModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// Get User Stories

usersRouter.get("/me/posts", basicAuthMiddleware, async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const posts = await BlogModel.find({ user: userId.toString() })
  
      res.status(200).send(posts)
  
    } catch (error) {
      next(error)
    }
  })

usersRouter.put("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await UsersModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body; // Get credentials from req.body

    const user = await UsersModel.checkCredentials(email, password); // Verify the credentials

    if (user) {
      // If credentials are fine we will generate a JWT token
      const accessToken = await JWTAuthenticate(user);
      res.status(200).send({ accessToken });
    } else {
      next(createHttpError(401, "Invalid Credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/currentUser/:email", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const email = req.params.email;
    let currentUser = await UsersModel.findOne({ email: email });
    res.status(200).send({ currentUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default usersRouter;

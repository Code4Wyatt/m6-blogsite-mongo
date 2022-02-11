import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./schema.js";
import passport from "passport"
import { basicAuthMiddleware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { check, validationResult } from "express-validator";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { JWTAuthenticate, verifyRefreshTokenAndGenerateNewTokens } from "../../auth/tools.js";

const usersRouter = express.Router();

usersRouter.post(
  "/",
  [
    check("email", "Please input a valid email").isEmail(),
    check(
      "password",
      "Please input a password with a min length of 6"
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
        });
      }

      res.status(201).send({ _id });
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
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Invalid Credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;

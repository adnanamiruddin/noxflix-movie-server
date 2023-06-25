import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("Username is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for username")
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("Username already exist");
    }),
  body("displayName")
    .exists()
    .withMessage("Diplay name is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for your display name"),
  body("password")
    .exists()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for password"),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm password is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for confirm password")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Confirm password does not match with your password");
      return true;
    }),
  requestHandler.validate,
  userController.signUp
);

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("Username is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for username"),
  body("password")
    .exists()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for password"),
  requestHandler.validate,
  userController.signIn
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("Your password is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for password"),
  body("newPassword")
    .exists()
    .withMessage("Your new password is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for new password"),
  body("confirmNewPassword")
    .exists()
    .withMessage("Confirm new password is required!")
    .isLength({ min: 8 })
    .withMessage("Minimum 8 characters for confirm new password")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error(
          "Confirm new password does not match with your new password"
        );
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getUserFavorites
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists()
    .withMessage("Media type is required!")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("Media type invalid"),
  body("mediaId")
    .exists()
    .withMessage("Media id is required!")
    .isLength({ min: 1 })
    .withMessage("Media id can not be empty!"),
  body("mediaTitle").exists().withMessage("Media title is required!"),
  body("mediaPoster").exists().withMessage("Media poster is required!"),
  body("mediaRate").exists().withMessage("Media rate is required!"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;

import express from "express";
import { body } from "express-validator";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get("/", tokenMiddleware.auth, reviewController.getUserReviews);

router.post(
  "/",
  tokenMiddleware.auth,
  body("mediaId")
    .exists()
    .withMessage("Media id is required!")
    .isLength({ min: 1 })
    .withMessage("Media id can not be empty!"),
  body("content")
    .exists()
    .withMessage("Content is required!")
    .isLength({ min: 1 })
    .withMessage("Content can not be empty!"),
  body("mediaType")
    .exists()
    .withMessage("Media type is required!")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("Media type invalid"),
  body("mediaTitle").exists().withMessage("Media title is required!"),
  body("mediaPoster").exists().withMessage("Media poster is required!"),
  requestHandler.validate,
  reviewController.create
);

router.delete("/:reviewId", tokenMiddleware.auth, reviewController.remove);

export default router;

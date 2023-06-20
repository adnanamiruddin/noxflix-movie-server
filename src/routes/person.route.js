import express from "express";
import personController from "../controllers/person.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/:person/medias", personController.getPersonMedias);

router.get("/:personId", personController.getPersonDetail);

export default router;

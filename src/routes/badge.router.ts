import { Router } from "express";
import BadgeController from "../controllers/badge.controller";

const router = Router();
const badgeController = new BadgeController();

router.get("/:groupId", badgeController.getBadges.bind(badgeController));

export default router;

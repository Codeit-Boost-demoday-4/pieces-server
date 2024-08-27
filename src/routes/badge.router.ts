import { Router } from "express";
import BadgeController from "../controllers/badge.controller";

const router = Router();
const badgeController = new BadgeController();

router.put("/groups/:groupId/badges", badgeController.updateBadges.bind(badgeController));

export default router;

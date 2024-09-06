"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const badge_controller_1 = __importDefault(require("../controllers/badge.controller"));
const router = (0, express_1.Router)();
const badgeController = new badge_controller_1.default();
router.get("/:groupId", badgeController.getBadges.bind(badgeController));
exports.default = router;

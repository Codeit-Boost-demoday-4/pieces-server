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
const badge_service_1 = __importDefault(require("../services/badge.service"));
const groupBadge_model_1 = __importDefault(require("../models/groupBadge.model"));
const badge_model_1 = __importDefault(require("../models/badge.model"));
/**
 * @swagger
 * /api/badges/{groupId}:
 *   get:
 *     summary: Get badges for a specific group
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the group to fetch badges for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully fetched badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       400:
 *         description: Invalid group ID
 *       500:
 *         description: An error occurred while fetching badges
 */
class BadgeController {
    constructor() {
        this.badgeService = new badge_service_1.default();
    }
    // 그룹의 뱃지 조회
    getBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupId = parseInt(req.params.groupId, 10);
            if (isNaN(groupId)) {
                res.status(400).json({ message: "Invalid group ID" });
                return;
            }
            try {
                const groupBadges = yield groupBadge_model_1.default.findAll({
                    where: { groupId },
                    include: [{ model: badge_model_1.default, as: 'badge' }],
                });
                const badges = groupBadges.map(groupBadge => {
                    var _a;
                    return ({
                        id: groupBadge.badgeId,
                        name: (_a = groupBadge.badge) === null || _a === void 0 ? void 0 : _a.name,
                    });
                });
                res.status(200).json(badges);
            }
            catch (error) {
                console.error("Error fetching badges:", error);
                res.status(500).json({ message: "An error occurred while fetching badges" });
            }
        });
    }
}
exports.default = BadgeController;

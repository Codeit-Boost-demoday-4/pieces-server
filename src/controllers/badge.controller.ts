import { Request, Response } from "express";
import BadgeService from "../services/badge.service";
import GroupBadge from "../models/groupBadge.model";
import Badge from "../models/badge.model";

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
  private badgeService: BadgeService;

  constructor() {
    this.badgeService = new BadgeService();
  }

  // 그룹의 뱃지 조회
  public async getBadges(req: Request, res: Response): Promise<void> {
    const groupId = parseInt(req.params.groupId, 10);

    if (isNaN(groupId)) {
      res.status(400).json({ message: "Invalid group ID" });
      return;
    }

    try {
      // 그룹에 연관된 뱃지 조회
      const groupBadges = await GroupBadge.findAll({
        where: { groupId },
        include: [{ model: Badge, as: 'badge' }],
      });

      // 뱃지 이름을 포함하여 응답
      const badges = groupBadges.map(groupBadge => ({
        id: groupBadge.badgeId,
        name: groupBadge.badge?.name,
      }));

      res.status(200).json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "An error occurred while fetching badges" });
    }
  }
}

export default BadgeController;

import { Request, Response } from "express";
import BadgeService from "../services/badge.service";

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Badge management and updates.
 */

/**
 * @swagger
 * /groups/{groupId}/badges:
 *   put:
 *     summary: Update badges for a specific group
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the group to update badges for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Badges updated successfully
 *       400:
 *         description: Invalid group ID
 *       500:
 *         description: An error occurred while updating badges
 */
class BadgeController {
  private badgeService: BadgeService;

  constructor() {
    this.badgeService = new BadgeService();
  }

  // 그룹의 뱃지 업데이트
  public async updateBadges(req: Request, res: Response): Promise<void> {
    const groupId = parseInt(req.params.groupId, 10);

    if (isNaN(groupId)) {
      res.status(400).json({ message: "Invalid group ID" });
      return;
    }

    try {
      // 뱃지 업데이트
      await this.badgeService.awardBadges(groupId);

      res.status(200).json({ message: "Badges updated successfully" });
    } catch (error) {
      console.error("Error updating badges:", error);
      res.status(500).json({ message: "An error occurred while updating badges" });
    }
  }
}

export default BadgeController;

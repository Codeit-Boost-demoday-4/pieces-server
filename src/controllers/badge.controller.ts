/*
import { Request, Response } from 'express';
import BadgeService from '../services/badge.service';

class BadgeController {
  // 그룹이 보유한 배지 조회
  static async getGroupBadges(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id, 10);
      const badges = await BadgeService.getGroupBadges(groupId);
      res.status(200).json(badges);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // 배지 조건 확인 및 자동 부여
  static async checkAndAwardBadges(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id, 10);
      const awardedBadges = await BadgeService.checkAndAwardBadges(groupId);
      res.status(200).json(awardedBadges);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default BadgeController;
*/
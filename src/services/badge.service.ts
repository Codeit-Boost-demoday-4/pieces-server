/*
import Badge from '../models/badge.model';
import GroupBadge from '../models/groupBadge.model';
import Group from '../models/group.model';
import Post from '../models/post.model'; // 그룹의 추억 모델
import { Op, Sequelize } from 'sequelize';

class BadgeService {
  // 특정 그룹이 보유한 배지 조회
  static async getGroupBadges(groupId: number) {
    return await GroupBadge.findAll({
      where: { groupId },
      include: [Badge],
    });
  }

  // 특정 그룹의 조건을 확인하고 배지 자동 부여
  static async checkAndAwardBadges(groupId: number) {
    const group = await Group.findByPk(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    const badgesToAward = [];

    // 조건 1: 7일 연속 추억 등록
    if (await this.hasPostedForSevenDays(groupId)) {
      badgesToAward.push('7일 연속 추억 등록');
    }

    // 조건 2: 추억 수 20개 이상 등록
    if (group.postCount >= 20) {
      badgesToAward.push('추억 수 20개 이상 등록');
    }

    // 조건 3: 그룹 생성 후 1년 달성
    if (this.hasReachedOneYear(group.createdAt)) {
      badgesToAward.push('그룹 생성 후 1년 달성');
    }

    // 조건 4: 그룹 공감 1만 개 이상 받기
    if (group.likeCount >= 10000) {
      badgesToAward.push('그룹 공감 1만 개 이상 받기');
    }

    // 조건 5: 추억 공감 1만 개 이상 받기
    if (await this.hasMemoryWithOverTenThousandLikes(groupId)) {
      badgesToAward.push('추억 공감 1만 개 이상 받기');
    }

    // 배지 부여
    const awardedBadges = [];
    for (const badgeName of badgesToAward) {
      const badge = await Badge.findOne({ where: { name: badgeName } });
      if (badge) {
        const [groupBadge, created] = await GroupBadge.findOrCreate({
          where: { groupId, badgeId: badge.id },
        });
        if (created) {
          awardedBadges.push(badge);
        }
      }
    }

    return awardedBadges;
  }

  
  // 도우미 메서드: 7일 연속 추억 등록 여부 확인
  static async hasPostedForSevenDays(groupId: number): Promise<boolean> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyPosts = await Post.findAll({
      where: {
        groupId,
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
      having: Sequelize.literal('COUNT(id) > 0'),
    });

    return dailyPosts.length >= 7;
  }

  // 도우미 메서드: 그룹 생성 후 1년 달성 여부 확인
  static hasReachedOneYear(createdAt: Date): boolean {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return createdAt <= oneYearAgo;
  }

  // 도우미 메서드: 공감 1만 개 이상의 추억이 있는지 확인
  static async hasMemoryWithOverTenThousandLikes(groupId: number): Promise<boolean> {
    const post = await {Post}.findOne({
      where: {
        groupId,
        likeCount: {
          [Op.gte]: 10000,
        },
      },
    });
    return post !== null;
  }
}

export default BadgeService;
*/
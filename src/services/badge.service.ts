import { Op } from "sequelize";
import Group from "../models/group.model";
import Badge from "../models/badge.model";
import GroupBadge from "../models/groupBadge.model";
import Post from "../models/post.model";
import PostLike from "../models/postLike.model";

class BadgeService {
  // 7일 연속 추억 등록
  private async checkConsecutivePosts(groupId: number): Promise<boolean> {
    const SEVEN_DAYS_AGO = new Date();
    SEVEN_DAYS_AGO.setDate(SEVEN_DAYS_AGO.getDate() - 7);

    const postCount = await Post.count({
      where: {
        groupId,
        createdAt: {
          [Op.gte]: SEVEN_DAYS_AGO,
        },
      },
    });

    return postCount >= 7;
  }

  // 추억 수 20개 이상 등록
  private async checkMinPosts(groupId: number): Promise<boolean> {
    const postCount = await Post.count({ where: { groupId } });
    return postCount >= 20;
  }

  // 그룹 생성 후 1년 달성
  private async checkGroupAge(groupId: number): Promise<boolean> {
    const group = await Group.findByPk(groupId);
    if (!group) return false;

    const ONE_YEAR_AGO = new Date();
    ONE_YEAR_AGO.setFullYear(ONE_YEAR_AGO.getFullYear() - 1);

    return group.createdAt <= ONE_YEAR_AGO;
  }

  // 그룹 공감 1만 개 이상 받기
  private async checkMinLikes(groupId: number): Promise<boolean> {
    const group = await Group.findByPk(groupId);
    if (!group) return false;
    
    return group.likeCount >= 10000;
  }

  // 추억 공감 1만 개 이상 받기
  private async checkMinPostLikes(groupId: number): Promise<boolean> {
    const postLikesCount = await PostLike.count({
      include: [{
        model: Post,
        where: { groupId },
      }],
    });

    return postLikesCount >= 10000;
  }

  // 그룹에 조건에 맞는 뱃지 추가
  public async awardBadges(groupId: number): Promise<void> {
    // Badge 테이블에서 모든 뱃지 가져오기
    const badges = await Badge.findAll();
    const badgeMap = new Map(badges.map(badge => [badge.name, badge.id]));

    // 조건과 대응되는 뱃지 이름과 메소드
    const badgeConditions: { badgeName: string, checkMethod: (groupId: number) => Promise<boolean> }[] = [
      { badgeName: '7일 연속 추억 등록', checkMethod: this.checkConsecutivePosts.bind(this) },
      { badgeName: '추억 수 20개 이상 등록', checkMethod: this.checkMinPosts.bind(this) },
      { badgeName: '그룹 생성 후 1년 달성', checkMethod: this.checkGroupAge.bind(this) },
      { badgeName: '그룹 공감 1만 개 이상 받기', checkMethod: this.checkMinLikes.bind(this) },
      { badgeName: '추억 공감 1만 개 이상 받기', checkMethod: this.checkMinPostLikes.bind(this) },
    ];

    // 현재 그룹에 부여된 뱃지 목록 가져오기
    const groupBadges = await GroupBadge.findAll({ where: { groupId } });
    const currentBadgeIds = new Set(groupBadges.map(gb => gb.badgeId));

    for (const condition of badgeConditions) {
      const { badgeName, checkMethod } = condition;
      
      // 뱃지 이름으로 ID 가져오기
      const badgeId = badgeMap.get(badgeName);
      if (!badgeId) continue;

      const shouldAwardBadge = await checkMethod(groupId);
      
      if (shouldAwardBadge && !currentBadgeIds.has(badgeId)) {
        // 뱃지 부여
        await GroupBadge.create({ groupId, badgeId });
      } else if (!shouldAwardBadge && currentBadgeIds.has(badgeId)) {
        // 뱃지 제거
        await GroupBadge.destroy({ where: { groupId, badgeId } });
      }
    }
  }
}

export default BadgeService;

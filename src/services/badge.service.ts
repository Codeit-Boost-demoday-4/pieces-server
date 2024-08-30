import { Op } from "sequelize";
import Group from "../models/group.model";
import Badge from "../models/badge.model";
import GroupBadge from "../models/groupBadge.model";
import Post from "../models/post.model";
import PostLike from "../models/postLike.model";

class BadgeService {
  // 7일 연속 추억 등록
  public async checkConsecutivePosts(groupId: number): Promise<boolean> {
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
  public async checkMinPosts(groupId: number): Promise<boolean> {
    const postCount = await Post.count({ where: { groupId } });
    return postCount >= 20;
  }

  // 그룹 생성 후 1년 달성
  public async checkGroupAge(groupId: number): Promise<boolean> {
    const group = await Group.findByPk(groupId);
    if (!group) return false;

    const ONE_YEAR_AGO = new Date();
    ONE_YEAR_AGO.setFullYear(ONE_YEAR_AGO.getFullYear() - 1);

    return group.createdAt <= ONE_YEAR_AGO;
  }

  // 그룹 공감 1만 개 이상 받기
  public async checkMinLikes(groupId: number): Promise<boolean> {
    const group = await Group.findByPk(groupId);
    if (!group) return false;
    
    return group.likeCount >= 10;
  }

  // 추억 공감 1만 개 이상 받기
  public async checkMinPostLikes(postId: number): Promise<boolean> {
    const post = await Post.findByPk(postId);
    if (!post) return false;

    return post.likeCount >= 15; // 예시로 10 개로 설정
  }

  //뱃지 부여
  public async awardBadge(groupId: number, badgeId: number): Promise<void> {
    // 현재 그룹에 부여된 뱃지 목록 가져오기
    const groupBadge = await GroupBadge.findOne({ where: { groupId, badgeId } });

    if (!groupBadge) {
      // 그룹에 뱃지가 없으면 새로 추가
      await GroupBadge.create({ groupId, badgeId });
      console.log(`뱃지 ID ${badgeId} 추가 완료`);
    }
  }
}
  /*
  // 그룹에 조건에 맞는 뱃지 추가
  public async awardBadges(groupId: number, postId?: number): Promise<void> {
    // Badge 테이블에서 모든 뱃지 가져오기
    const badges = await Badge.findAll();
    const badgeMap = new Map(badges.map(badge => [badge.name, badge.id]));

    // 조건과 대응되는 뱃지 이름과 메소드
    const badgeConditions: { badgeName: string, checkMethod: (id: number) => Promise<boolean> }[] = [
      { badgeName: '7일 연속 추억 등록', checkMethod: this.checkConsecutivePosts.bind(this) },
      { badgeName: '추억 수 20개 이상 등록', checkMethod: this.checkMinPosts.bind(this) },
      { badgeName: '그룹 생성 후 1년 달성', checkMethod: this.checkGroupAge.bind(this) },
      { badgeName: '그룹 공감 1만 개 이상 받기', checkMethod: this.checkMinLikes.bind(this) },
      { badgeName: '추억 공감 1만 개 이상 받기', checkMethod: this.checkMinPostLikes.bind(this) },
    ];

    // 현재 그룹에 부여된 뱃지 목록 가져오기
    const groupBadges = await GroupBadge.findAll({ where: { groupId } });
    const currentBadgeIds = new Set(groupBadges.map(gb => gb.badgeId));
    console.log(`현재 그룹에 부여된 뱃지 목록: ${Array.from(currentBadgeIds)}`);

    const badgesToProcess = new Set<number>();

    for (const condition of badgeConditions) {
      const { badgeName, checkMethod } = condition;
      
      
      // 뱃지 이름으로 ID 가져오기
      const badgeId = badgeMap.get(badgeName);
      if (!badgeId) continue;

      // 그룹에 대한 조건과 게시글에 대한 조건을 분리하여 확인
      const shouldAwardBadge = postId
        ? await checkMethod(postId)
        : await checkMethod(groupId);

        console.log(`뱃지 조건(${badgeName}): ${shouldAwardBadge}`);

      if (shouldAwardBadge && !currentBadgeIds.has(badgeId)) {
        // 뱃지 추가
        await GroupBadge.create({ groupId, badgeId });
        console.log('뱃지 추가 완료')
      } else if (!shouldAwardBadge && currentBadgeIds.has(badgeId)) {
        // 뱃지 제거
        await GroupBadge.destroy({ where: { groupId, badgeId } });
        console.log('뱃지 제거 완료')

      }
    }
  }
*/

export default BadgeService;

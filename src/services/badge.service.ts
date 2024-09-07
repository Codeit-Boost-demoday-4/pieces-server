import { Op } from "sequelize";
import Group from "../models/group.model";
import GroupBadge from "../models/groupBadge.model";
import Post from "../models/post.model";

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
    
    return group.likeCount >= 10000;
  }

  // 추억 공감 1만 개 이상 받기
  public async checkMinPostLikes(postId: number): Promise<boolean> {
    const post = await Post.findByPk(postId);
    if (!post) return false;

    return post.likeCount >= 10000; // 예시로 10 개로 설정
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

export default BadgeService;

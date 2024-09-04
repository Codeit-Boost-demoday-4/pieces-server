import { Op } from 'sequelize';
import Group from '../models/group.model';
import bcrypt from 'bcryptjs';
import BadgeService from './badge.service';
 
interface GetGroupsParams {
  page: number;
  pageSize: number;
  sortBy: 'latest' | 'mostPosted' | 'mostLiked' | 'mostBadge';
  keyword: string;
  isPublic: boolean;
}
class GroupService {

  private badgeService: BadgeService;

  constructor() {
    this.badgeService = new BadgeService();
  }

  //ID로 특정 그룹 가져오기
  async getGroupById(id: number) {
    const group = await Group.findByPk(id);
    if (!group) {
      throw new Error('그룹을 찾을 수 없습니다.');
    }

  //그룹 생성 후 1년 달성 조건 검사
  const groupAgeMet = await this.badgeService.checkGroupAge(id);
  if (groupAgeMet) {
    await this.badgeService.awardBadge(id, 3);
    //badgeCount 계산 및 저장
    await group.calculateBadgeCount();    
  }
    return group;
  }

  //그룹 생성
  async createGroup(data: {
    id: number;
    name: string;
    imageUrl: string;
    introduction: string;
    isPublic: boolean;
    passwordHash: string;
  }) {
    const group = await Group.create(data);
    return group;
  }
  
  async getGroups(params: GetGroupsParams) {
    const { page, pageSize, sortBy, keyword, isPublic } = params;
    const offset = (page - 1) * pageSize;
  
    //기본 정렬 기준
    let order: any;
    switch (sortBy) {
      case 'latest':
        order = [['createdAt', 'DESC']];
        break;
      case 'mostPosted':
        order = [['postCount', 'DESC']];
        break;
      case 'mostLiked':
        order = [['likeCount', 'DESC']];
        break;
      case 'mostBadge':
        order = [['badgeCount', 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }
  
    //검색 조건
    const searchCondition = keyword
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {};
  
    //쿼리 생성
    const query: any = {
      where: {
        ...searchCondition,
        isPublic,
      },
      order,
      limit: pageSize,
      offset,
    };
  
    //총 아이템 수 조회
    const totalItemCount = await Group.count({ where: { ...searchCondition, isPublic } });
  
    //그룹 목록 조회
    const groups = await Group.findAll({
      ...query,
      attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
    });
  
    const totalPages = Math.ceil(totalItemCount / pageSize);
  
    return {
      currentPage: page,
      totalPages,
      totalItemCount,
      data: groups,
    };
  }
  
  //그룹 수정
  async updateGroup(id: number, data: Partial<{
    name: string;
    imageUrl: string;
    introduction: string;
    isPublic: boolean;
  }>) {
    const group = await this.getGroupById(id);
    await group.update(data);
    return group;
  }

  //그룹 삭제
  async deleteGroup(id: number) {
    const group = await this.getGroupById(id);
    await group.destroy();
    return { message: '그룹을 성공적으로 삭제했습니다.' };
  }

    //비밀번호 검증 메소드
    async verifyGroupPassword(id: number, password: string): Promise<boolean> {
      const group = await this.getGroupById(id);
      const isMatch = await bcrypt.compare(password, group.passwordHash);
      return isMatch;
    }

  //공감 메소드
  async incrementLikeCount(id: number): Promise<Group> {
    const group = await this.getGroupById(id);
    group.likeCount += 1;
    await group.save();

  //공감 개수 조건을 검사
  const minLikesMet = await this.badgeService.checkMinLikes(id);

  const badgeId = 4;

  //조건이 만족되면 뱃지를 부여
  if (minLikesMet) {
    await this.badgeService.awardBadge(id, badgeId);
  }

    //badgeCount 계산 및 저장
    await group.calculateBadgeCount();    
    return group;
  }

  //그룹 공개 여부 확인
  async checkIfGroupIsPublic(id: number): Promise<{ id: number; isPublic: boolean }> {
    const group = await this.getGroupById(id);
    return { id: group.id, isPublic: group.isPublic };
  }


}



export default new GroupService();

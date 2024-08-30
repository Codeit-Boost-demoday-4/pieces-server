import { Op } from 'sequelize';
import Group from '../models/group.model'; // Group 모델 import
import bcrypt from 'bcryptjs';
import BadgeService from './badge.service';
 
class GroupService {

  private badgeService: BadgeService;

  constructor() {
    this.badgeService = new BadgeService();
  }

// ID로 특정 그룹 가져오기
  async getGroupById(id: number) {
    const group = await Group.findByPk(id);
    if (!group) {
      throw new Error('그룹을 찾을 수 없습니다.');
    }

      // 그룹 생성 후 1년 달성 조건 검사
  const groupAgeMet = await this.badgeService.checkGroupAge(id);
  if (groupAgeMet) {
    await this.badgeService.awardBadge(id, 3);
    // badgeCount 계산 및 저장
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

// 공개,비공개 그룹 따로 조회
  async getGroups(isPublic?: boolean) {
    let query: any = {
      isPublic
    };

    const groups = await Group.findAll({
      where: query,
      attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
    });

    return groups;
  }


  /* 모든 그룹 조회
  async getGroups(isPublic?: boolean) {
    let query: any = {};

    if (isPublic !== undefined) {
      query.isPublic = isPublic;
    }
    
    const publicGroups = await Group.findAll({
        //공개그룹 조회
      where: { isPublic: true },
      attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
    });

    //비공개그룹 조회
    const privateGroups = await Group.findAll({
      where: { isPublic: false },
      attributes: ['id', 'name', 'isPublic', 'introduction', 'createdAt','postCount', 'likeCount'],
    });

    return { publicGroups, privateGroups };
  }
*/
  
// 그룹 수정
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

// 그룹 삭제
  async deleteGroup(id: number) {
    const group = await this.getGroupById(id);
    await group.destroy();
    return { message: '그룹을 성공적으로 삭제했습니다.' };
  }

// 비밀번호 검증 메소드
    async verifyGroupPassword(id: number, password: string): Promise<boolean> {
      const group = await this.getGroupById(id);
      const isMatch = await bcrypt.compare(password, group.passwordHash);
      return isMatch;
    }

// 공감 메소드
  async incrementLikeCount(id: number): Promise<Group> {
    const group = await this.getGroupById(id);
    group.likeCount += 1;
    await group.save();

  // 공감 개수 조건을 검사
  const minLikesMet = await this.badgeService.checkMinLikes(id);

  const badgeId = 4;

  // 조건이 만족되면 뱃지를 부여
  if (minLikesMet) {
    await this.badgeService.awardBadge(id, badgeId);
  }

    // badgeCount 계산 및 저장
    await group.calculateBadgeCount();    
    return group;
  }

// 그룹 공개 여부 확인
  async checkIfGroupIsPublic(id: number): Promise<{ id: number; isPublic: boolean }> {
    const group = await this.getGroupById(id);
    return { id: group.id, isPublic: group.isPublic };
  }

// 그룹명으로 그룹 검색
  async getGroupsByName(isPublic: boolean, name?: string) {
    let query: any = {
      isPublic
    };
  
    // 그룹 이름으로 검색
    if (name) {
      query.name = {
        [Op.like]: `%${name}%`,  // 부분 일치 검색, 대소문자 구분 x
      };
    }
  
    // 그룹을 조회
    const groups = await Group.findAll({
      where: query,
      attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'createdAt', 'postCount', 'likeCount', 'badgeCount'],
    });
  
    return groups;
  }

}


export default new GroupService();

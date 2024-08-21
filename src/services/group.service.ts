import Group from '../models/group.model'; // Group 모델 import

class GroupService {

// ID로 특정 그룹 가져오기
  async getGroupById(id: number) {
    const group = await Group.findByPk(id);
    if (!group) {
      throw new Error('그룹을 찾을 수 없습니다.');
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

  // 공개/비공개 그룹 따로 조회
  async getGroups(isPublic?: boolean) {
    let query: any = {};

    if (isPublic !== undefined) {
      query.isPublic = isPublic;
    }

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
}


export default new GroupService();

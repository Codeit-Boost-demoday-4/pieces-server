import Group from '../models/group.model'; // Group 모델 import

class GroupService {

//그룹 생성
  async createGroup(data: {
    name: string;
    imageUrl: string;
    introduction: string;
    isPublic: boolean;
    passwordHash: string;
  }) {
    const group = await Group.create(data);
    return group;
  }

  // 그룹 조회
  async getGroups() {
    const publicGroups = await Group.findAll({
        //공개그룹 조회
      where: { isPublic: true },
      attributes: ['id', 'name', 'imageUrl', 'isPublic', 'introduction', 'likeCount', 'badgeCount', 'postCount', 'createdAt'],
    });

    //비공개그룹 조회
    const privateGroups = await Group.findAll({
      where: { isPublic: false },
      attributes: ['id', 'name', 'isPublic', 'introduction', 'likeCount', 'postCount', 'createdAt'],
    });

    return { publicGroups, privateGroups };
  }
}

export default new GroupService();

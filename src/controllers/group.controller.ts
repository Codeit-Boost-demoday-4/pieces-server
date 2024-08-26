import { Request, Response } from 'express';
import GroupService from '../services/group.service';
import bcrypt from 'bcryptjs';
  
class GroupController {
      /**
   * @swagger
   * /api/groups:
   *   post:
   *     summary: 그룹을 생성합니다.
   *     tags:
   *       - Groups
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *               introduction:
   *                 type: string
   *               isPublic:
   *                 type: boolean
   *               password:
   *                 type: string
   *             example:
   *               name: "New Group"
   *               imageUrl: "http://example.com/image.png"
   *               introduction: "This is a new group."
   *               isPublic: true
   *               password: "password123"
   *     responses:
   *       201:
   *         description: 등록 성공!
   *       400:
   *         description: 잘못된 요청입니다.
   */
  async createGroup(req: Request, res: Response) {
    try {
      const { id, name, imageUrl, introduction, isPublic, password } = req.body;

      // 비밀번호를 해시화하여 저장
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const group = await GroupService.createGroup({
        id,
        name,
        imageUrl,
        introduction,
        isPublic,
        passwordHash,
      });

        // 응답에서 passwordHash, createdAt, updatedAt을 제거한 후 반환
        const { passwordHash: _, createdAt, updatedAt, ...groupWithoutSensitiveInfo } = group.get({ plain: true });

      res.status(201).json(groupWithoutSensitiveInfo);
    } catch (error) {
      res.status(400).json({ error: '잘못된 요청입니다' });
    }
  }

/**
   * @swagger
   * /api/groups:
   *   get:
   *     summary: 그룹 목록을 조회합니다.
   *     description: 공개여부에 따라 그룹을 조회합니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: query
   *         name: isPublic
   *         schema:
   *           type: boolean
   *           default: true
   *         description: '그룹의 공개 여부 (true: 공개, false: 비공개)'
   *     responses:
   *       200:
   *         description: A list of groups
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   imageUrl:
   *                     type: string
   *                   introduction:
   *                     type: string
   *                   isPublic:
   *                     type: boolean
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Server error
   */
async getGroups(req: Request, res: Response) {
  try {
    const isPublic = req.query.isPublic === 'false' ? false : true; // 기본값은 true
    const groups = await GroupService.getGroups(isPublic);
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//그룹 상세 조회
  async getGroupById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const group = await GroupService.getGroupById(parseInt(id));
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: '존재하지 않습니다.' });
    }
}

  /**
   * @swagger
   * /api/groups/{id}:
   *   put:
   *     summary: 그룹을 수정합니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: 수정할 그룹의 id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               imageUrl:
   *                 type: string
   *               introduction:
   *                 type: string
   *               isPublic:
   *                 type: boolean
   *               password:
   *                 type: string
   *                 description: 비밀번호 확인
   *             example:
   *               name: "Updated Group"
   *               imageUrl: "http://example.com/newimage.png"
   *               introduction: "This is an updated group."
   *               isPublic: true
   *               password: "password123"
   *     responses:
   *       200:
   *         description: 업데이트 성공!
   *       400:
   *         description: 잘못된 요청입니다.
   *       403:
   *         description: 비밀번호가 틀렸습니다.
   *       404:
   *         description: 존재하지 않습니다.
   */
  async updateGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, imageUrl, introduction, isPublic, password } = req.body;

      const group = await GroupService.getGroupById(parseInt(id));

      // 비밀번호 확인
      const isMatch = await bcrypt.compare(password, group.passwordHash);
      if (!isMatch) {
          return res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
      }

      const updatedData: Partial<{
        name: string;
        imageUrl: string;
        introduction: string;
        isPublic: boolean;
      }> = { name, imageUrl, introduction, isPublic };

      const updatedGroup = await GroupService.updateGroup(parseInt(id), updatedData);

      res.status(200).json(updatedGroup);
    } catch (error) {
      res.status(400).json({ error: '잘못된 요청입니다' });
    }
    
  }

  /**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: 그룹을 삭제합니다.
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 그룹의 id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: 비밀번호 확인
 *             example:
 *               password: "password123"
 *     responses:
 *       200:
 *         description: 삭제 성공!
 *       403:
 *         description: 비밀번호가 틀렸습니다.
 *       404:
 *         description: 그룹을 찾을 수 없습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 *       500:
 *         description: 서버 오류
   */
  async deleteGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const group = await GroupService.getGroupById(parseInt(id));

      // 비밀번호 확인
      const isMatch = await bcrypt.compare(password, group.passwordHash);
      if (!isMatch) {
          return res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
      }

      await GroupService.deleteGroup(parseInt(id));

      res.status(200).json({ message: '그룹이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        res.status(400).json({ error: '잘못된 요청입니다' });
      }
  }

    /**
   * @swagger
   * /api/groups/{id}/verify-password:
   *   post:
   *     summary: 그룹 접근 시 비밀번호를 검증합니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: 검증할 그룹의 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 description: 그룹 비밀번호
   *             example:
   *               password: "password123"
   *     responses:
   *       200:
   *         description: 비밀번호가 확인되었습니다.
   *       403:
   *         description: 비밀번호가 틀렸습니다.
   *       404:
   *         description: 존재하지 않습니다.
   */
    async verifyGroupPassword(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const { password } = req.body;
  
        const isValid = await GroupService.verifyGroupPassword(parseInt(id), password);
  
        if (isValid) {
          res.status(200).json({ message: '비밀번호가 확인되었습니다.' });
        } else {
          res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
        }
      } catch (error) {
        res.status(404).json({ error: '존재하지 않습니다.' });
      }
    }

  /**
   * @swagger
   * /api/groups/{id}/like:
   *   post:
   *     summary: 그룹의 likeCount를 1 증가시킵니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: like를 증가시킬 그룹의 ID
   *     responses:
   *       200:
   *         description: 그룹 공감하기 성공
   *       404:
   *         description: 존재하지 않습니다.
   */
  async likeGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updatedGroup = await GroupService.incrementLikeCount(parseInt(id));

      res.status(200).json({ message: '그룹 공감하기 성공', likeCount: updatedGroup.likeCount });
    } catch (error) {
      res.status(404).json({ error: '존재하지 않습니다.' });
    }
  }

  /**
   * @swagger
   * /api/groups/{id}/is-public:
   *   get:
   *     summary: 그룹의 공개 여부를 확인합니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: 공개 여부를 확인할 그룹의 ID
   *     responses:
   *       200:
   *         description: 그룹의 공개 여부를 반환합니다.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 isPublic:
   *                   type: boolean
   *       404:
   *         description: 존재하지 않습니다.
   */
  async checkGroupIsPublic(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const groupStatus = await GroupService.checkIfGroupIsPublic(parseInt(id));

      res.status(200).json(groupStatus);
    } catch (error) {
      res.status(404).json({ error: '존재하지 않습니다.' });
    }
  }

  /**
   * @swagger
   * /api/groups/search:
   *   get:
   *     summary: 그룹을 조회합니다. 공개 여부와 이름으로 검색할 수 있습니다.
   *     tags:
   *       - Groups
   *     parameters:
   *       - in: query
   *         name: isPublic
   *         schema:
   *           type: boolean
   *           default: true
   *           description: '그룹의 공개 여부 (true: 공개, false: 비공개).'
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *           description: '검색할 그룹 이름'
   *     responses:
   *       200:
   *         description: 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   imageUrl:
   *                     type: string
   *                   introduction:
   *                     type: string
   *                   isPublic:
   *                     type: boolean
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   postCount:
   *                     type: integer
   *                   likeCount:
   *                     type: integer
   *                   badgeCount:
   *                     type: integer
   *       500:
   *         description: 서버 오류
   */
  async getGroupsByName(req: Request, res: Response) {
    try {
      // 쿼리 매개변수에서 isPublic과 name을 가져옵니다.
      const isPublic = req.query.isPublic === 'false' ? false : true; // 기본값은 true
      const name = req.query.name as string;

          // 입력된 쿼리 매개변수 로깅
    console.log(`Query Parameters - isPublic: ${isPublic}, name: ${name}`);

      // 그룹 조회 서비스 호출
      const groups = await GroupService.getGroupsByName(isPublic, name);

          // 조회된 그룹을 반환하기 전에 로깅
    console.log('Retrieved Groups: ', groups);

      // 조회된 그룹 반환
      res.status(200).json(groups);
    } catch (error) {
      // 서버 오류 처리
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  }

}
export default new GroupController();

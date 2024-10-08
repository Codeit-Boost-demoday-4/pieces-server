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
   *               password: "pw123"
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
   *     summary: 그룹 목록 조회
   *     description: 페이지네이션, 검색, 정렬 기능을 사용하여 그룹 목록을 조회합니다.
   *     tags: [Groups]
   *     parameters:
   *       - name: page
   *         in: query
   *         description: 현재 페이지 번호
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *       - name: pageSize
   *         in: query
   *         description: 페이지당 아이템 수
   *         required: true
   *         schema:
   *           type: integer
   *           example: 10
   *       - name: sortBy
   *         in: query
   *         description: 정렬 기준 (latest, mostPosted, mostLiked, mostBadge)
   *         required: true
   *         schema:
   *           type: string
   *           enum: [latest, mostPosted, mostLiked, mostBadge]
   *           example: latest
   *       - name: keyword
   *         in: query
   *         description: 검색어
   *         schema:
   *           type: string
   *       - name: isPublic
   *         in: query
   *         description: 공개 여부 (true 또는 false)
   *         required: true
   *         schema:
   *           type: boolean
   *           example: true
   *     responses:
   *       200:
   *         description: 그룹 목록 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                 totalPages:
   *                   type: integer
   *                   example: 5
   *                 totalItemCount:
   *                   type: integer
   *                   example: 50
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       name:
   *                         type: string
   *                         example: "그룹 이름"
   *                       imageUrl:
   *                         type: string
   *                         example: "http://example.com/image.jpg"
   *                       isPublic:
   *                         type: boolean
   *                         example: true
   *                       likeCount:
   *                         type: integer
   *                         example: 0
   *                       badgeCount:
   *                         type: integer
   *                         example: 0
   *                       postCount:
   *                         type: integer
   *                         example: 0
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-02-22T07:47:49.803Z"
   *                       introduction:
   *                         type: string
   *                         example: "그룹 소개"
   *       400:
   *         description: 잘못된 요청
   *       500:
   *         description: 서버 오류
   */
  async getGroups(req: Request, res: Response) {
    try {
      const { page, pageSize, sortBy, keyword, isPublic } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);
      const sortByString = sortBy as string;
      const keywordString = keyword as string;
      const isPublicBoolean = isPublic === 'true';

      const groups = await GroupService.getGroups({
        page: pageNumber,
        pageSize: pageSizeNumber,
        sortBy: sortByString as 'latest' | 'mostPosted' | 'mostLiked' | 'mostBadge',
        keyword: keywordString || '',
        isPublic: isPublicBoolean,
      });

      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ error: '서버 오류' });
    }
  }

//그룹 상세 조회
  async getGroupById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const group = await GroupService.getGroupById(parseInt(id));
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: '그룹이 존재하지 않습니다.' });
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
   *               password: "pw123"
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
 *               password: "pw123"
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

    // 그룹 ID 파싱
    const groupId = parseInt(id);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: '유효한 그룹 ID를 입력하세요.' });
    }

    // 그룹 찾기
    const group = await GroupService.getGroupById(groupId);
    
    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, group.passwordHash);
    if (!isMatch) {
      return res.status(403).json({ error: '비밀번호가 틀렸습니다.' });
    }

    // 그룹 삭제
    await GroupService.deleteGroup(groupId);

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
   *               password: "pw123"
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


}
export default new GroupController();

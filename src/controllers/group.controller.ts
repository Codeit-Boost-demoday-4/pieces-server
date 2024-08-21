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
 *     summary: 모든 그룹을 조회합니다.
 *     description: Retrieve a list of all groups, including public and private groups.
 *     tags:
 *       - Groups
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
 *                   name:
 *                     type: string
 *                     description: The name of the group
 *                   imageUrl:
 *                     type: string
 *                     description: URL of the group's image
 *                   introduction:
 *                     type: string
 *                     description: Introduction to the group
 *                   isPublic:
 *                     type: boolean
 *                     description: Indicates if the group is public
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Creation timestamp of the group
 *       500:
 *         description: Server error
 */
  async getGroups(req: Request, res: Response) {
    try {
      const groups = await GroupService.getGroups();
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ error: '그룹 조회에 실패했습니다.' });
    }
  }

  async getGroupById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const group = await GroupService.getGroupById(parseInt(id));
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
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
   *         description: 비밀번호가 일치하지 않습니다.
   *       404:
   *         description: 그룹을 찾을 수 없습니다.
   */
  async updateGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, imageUrl, introduction, isPublic, password } = req.body;

      const group = await GroupService.getGroupById(parseInt(id));

      // 비밀번호 확인
      const isMatch = await bcrypt.compare(password, group.passwordHash);
      if (!isMatch) {
          return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
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
 *         description: 비밀번호가 일치하지 않습니다.
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
          return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
      }

      await GroupService.deleteGroup(parseInt(id));

      res.status(200).json({ message: '그룹이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        res.status(400).json({ error: '잘못된 요청입니다' });
      }
  }
}
export default new GroupController();

import { Request, Response } from 'express';
import GroupService from '../services/group.service';
import bcrypt from 'bcrypt';

class GroupController {
      /**
   * @swagger
   * /api/groups:
   *   post:
   *     summary: Create a new group
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
   *         description: 등록 성공
   *       400:
   *         description: 잘못된 요청입니다
   */
  async createGroup(req: Request, res: Response) {
    try {
      const { name, imageUrl, introduction, isPublic, password } = req.body;

      // 비밀번호를 해시화하여 저장
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const group = await GroupService.createGroup({
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
 *     summary: Retrieve all groups
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
      res.status(500).json({ error: 'Failed to retrieve groups' });
    }
  }
}

export default new GroupController();

import { Request, Response } from "express";
import PostService from "../services/post.service";

class PostController {
  // 게시글 생성
  /**
   * @swagger
   * /:
   *   post:
   *     summary: Create a new post
   *     tags:
   *       - Posts
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nickname
   *               - groupId
   *               - title
   *               - postPassword
   *               - content
   *               - isPublic
   *             properties:
   *               nickname:
   *                 type: string
   *                 description: Nickname of the user creating the post
   *                 example: "user123"
   *               groupId:
   *                 type: integer
   *                 description: ID of the group the post belongs to
   *                 example: 1
   *               title:
   *                 type: string
   *                 description: Title of the post
   *                 example: "My First Post"
   *               postPassword:
   *                 type: string
   *                 description: Password to protect the post
   *                 example: "1234"
   *               imageUrl:
   *                 type: string
   *                 description: URL of the post image
   *                 example: "http://example.com/image.jpg"
   *               content:
   *                 type: string
   *                 description: Content of the post
   *                 example: "This is the content of the post."
   *               location:
   *                 type: string
   *                 description: Location associated with the post
   *                 example: "Seoul, Korea"
   *               moment:
   *                 type: string
   *                 format: date-time
   *                 description: Date and time when the event in the post occurred
   *                 example: "2024-08-27T14:00:00Z"
   *               isPublic:
   *                 type: boolean
   *                 description: Whether the post is public or not
   *                 example: true
   *     responses:
   *       201:
   *         description: Successfully created a post
   *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 postId:
 *                   type: integer
 *                   description: ID of the created post
 *                   example: 1
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
   */
  async createPost(req: Request, res: Response) {
    try {
      const result = await PostService.createPost(req.body);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }

  // 게시글 조회
  async getPosts(req: Request, res: Response) {
    try {
      const sortBy = (req.query.sortBy as string) || "latest";

      if (!["latest", "mostCommented", "mostLiked"].includes(sortBy)) {
        return res.status(400).json({ message: "잘못된 정렬 기준입니다" });
      }

      const params = {
        page: parseInt(req.query.page as string, 10) || 1,
        pageSize: parseInt(req.query.pageSize as string, 10) || 10,
        sortBy: sortBy as "latest" | "mostCommented" | "mostLiked",
        keyword: req.query.keyword as string,
        isPublic: req.query.isPublic === "true",
        groupId: req.query.groupId
          ? parseInt(req.query.groupId as string, 10)
          : undefined,
      };
      const result = await PostService.getPosts(params);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }

  // 게시글 수정
  async updatePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.updatePost(postId, req.body);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }

  // 게시글 삭제
  async deletePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.deletePost(postId, req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
  }
}

export default new PostController();

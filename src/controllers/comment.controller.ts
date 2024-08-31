import { Request, Response } from "express";
import CommentService from "../services/comment.service";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */
class CommentController {
  /**
   * @swagger
   * /api/posts/{postId}/comments:
   *   post:
   *     summary: 댓글 생성
   *     tags: [Comments]
   *     parameters:
   *       - name: postId
   *         in: path
   *         required: true
   *         description: 게시글 ID
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nickname:
   *                 type: string
   *                 example: "JohnDoe"
   *               content:
   *                 type: string
   *                 example: "This is a comment"
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: 댓글 생성 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 nickname:
   *                   type: string
   *                   example: "JohnDoe"
   *                 content:
   *                   type: string
   *                   example: "This is a comment"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T00:00:00Z"
   *       500:
   *         description: 서버 오류
   */
  async createComment(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await CommentService.createComment(postId, req.body);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }

  /**
   * @swagger
   * /api/posts/{postId}/comments:
   *   get:
   *     summary: 댓글 목록 조회
   *     tags: [Comments]
   *     parameters:
   *       - name: postId
   *         in: query
   *         required: true
   *         description: 게시글 ID
   *         schema:
   *           type: integer
   *       - name: page
   *         in: query
   *         description: 페이지 번호
   *         schema:
   *           type: integer
   *           default: 1
   *       - name: pageSize
   *         in: query
   *         description: 페이지 크기
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: 댓글 목록 조회 성공
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
   *                       nickname:
   *                         type: string
   *                         example: "JohnDoe"
   *                       content:
   *                         type: string
   *                         example: "This is a comment"
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-01-01T00:00:00Z"
   *       500:
   *         description: 서버 오류
   */
  async getComments(req: Request, res: Response) {
    try {
      const params = {
        page: parseInt(req.query.page as string, 10) || 1,
        pageSize: parseInt(req.query.pageSize as string, 10) || 10,
        postId: parseInt(req.query.postId as string, 10), // 게시글 ID 필드 추가
      };

      const result = await CommentService.getComments(params);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }

  /**
   * @swagger
   * /api/comments/{commentId}:
   *   put:
   *     summary: 댓글 수정
   *     tags: [Comments]
   *     parameters:
   *       - name: commentId
   *         in: path
   *         required: true
   *         description: 댓글 ID
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nickname:
   *                 type: string
   *                 example: "JohnDoe"
   *               content:
   *                 type: string
   *                 example: "Updated comment"
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: 댓글 수정 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 nickname:
   *                   type: string
   *                   example: "JohnDoe"
   *                 content:
   *                   type: string
   *                   example: "Updated comment"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T00:00:00Z"
   *       404:
   *         description: 댓글이 존재하지 않음
   *       403:
   *         description: 비밀번호가 틀림
   *       500:
   *         description: 서버 오류
   */
  async updateComment(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await CommentService.updateComment(commentId, req.body);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }

  /**
   * @swagger
   * /api/comments/{commentId}:
   *   delete:
   *     summary: 댓글 삭제
   *     tags: [Comments]
   *     parameters:
   *       - name: commentId
   *         in: path
   *         required: true
   *         description: 댓글 ID
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: 댓글 삭제 성공
   *       404:
   *         description: 댓글이 존재하지 않음
   *       403:
   *         description: 비밀번호가 틀림
   *       500:
   *         description: 서버 오류
   */
  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await CommentService.deleteComment(commentId, req.body);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }
}

export default new CommentController();

import { Request, Response } from "express";
import CommentService from "../services/comment.service";

class CommentController {
  // 댓글 생성
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

  // 댓글 목록 조회
  async getComments(req: Request, res: Response) {
    try {
      const params = {
        page: parseInt(req.query.page as string, 10) || 1,
        pageSize: parseInt(req.query.pageSize as string, 10) || 10,
        commentId: req.query.commentId
          ? parseInt(req.query.commentId as string, 10)
          : undefined,
      };

      const result = await CommentService.getComments(params);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }
}

export default new CommentController();

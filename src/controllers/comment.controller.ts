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
}

export default new CommentController();

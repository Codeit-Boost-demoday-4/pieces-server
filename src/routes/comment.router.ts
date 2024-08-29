import { Router } from "express";
import CommentController from "../controllers/comment.controller";

const router = Router();

router.post("/posts/:postId/comments", CommentController.createComment); //댓글 생성
router.get("/posts/:postId/comments", CommentController.getComments); //댓글 목록 조회
router.put("/comments/:commentId", CommentController.updateComment); //댓글 수정
router.delete("/comments/:commentId", CommentController.deleteComment); //댓글 삭제

export default router;

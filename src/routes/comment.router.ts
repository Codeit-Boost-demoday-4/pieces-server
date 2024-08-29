import { Router } from "express";
import CommentController from "../controllers/comment.controller";

const router = Router();

router.post("/posts/:postId/comments", CommentController.createComment); //댓글 생성
router.get("/posts/:postId/comments", CommentController.getComments); //댓글 생성

export default router;

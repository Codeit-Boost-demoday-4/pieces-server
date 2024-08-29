import { Router } from "express";
import CommentController from "../controllers/comment.controller";

const router = Router();

router.post("/groups/:groupId/posts", CommentController.createComment); //게시글 생성

export default router;

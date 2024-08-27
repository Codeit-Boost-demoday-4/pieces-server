import { Router } from "express";
import PostController from "../controllers/post.controller";

const router = Router();

router.post("/groups/:groupId/posts", PostController.createPost); //게시글 생성
router.get("/groups/:groupId/posts", PostController.getPosts); //게시글 조회
router.put("/posts/:postId", PostController.updatePost); //게시글 수정
router.delete("/posts/:postId", PostController.deletePost); //게시글 삭제

export default router;

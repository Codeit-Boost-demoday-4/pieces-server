import { Router } from "express";
import PostController from "../controllers/post.controller";

const router = Router();

router.post("/", PostController.createPost); //게시글 생성
router.get("/", PostController.getPosts); //게시글 조회
router.put("/:id", PostController.updatePost); //게시글 수정
router.delete("/:id", PostController.deletePost); //게시글 삭제

export default router;

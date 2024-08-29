import { Router } from "express";
import PostController from "../controllers/post.controller";

const router = Router();

router.post("/groups/:groupId/posts", PostController.createPost); //게시글 생성
router.get("/groups/:groupId/posts", PostController.getPosts); //게시글 목록 조회
router.put("/posts/:postId", PostController.updatePost); //게시글 수정
router.delete("/posts/:postId", PostController.deletePost); //게시글 삭제
router.get("/posts/:postId", PostController.getPostDetail); //게시글 상세 정보 조회
router.post(
  "/posts/:postId/verify-password",
  PostController.verifyPostPassword
); //게시글 상세 정보 조회
router.post("/posts/:postId/like", PostController.likePost); // 게시글 공감하기
router.get("/posts/:postId/is-public", PostController.checkPostIsPublic); // 게시글 공개 여부 조회

export default router;

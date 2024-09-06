"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const router = (0, express_1.Router)();
router.post("/groups/:groupId/posts", post_controller_1.default.createPost); //게시글 생성
router.get("/groups/:groupId/posts", post_controller_1.default.getPosts); //게시글 목록 조회
router.put("/posts/:postId", post_controller_1.default.updatePost); //게시글 수정
router.delete("/posts/:postId", post_controller_1.default.deletePost); //게시글 삭제
router.get("/posts/:postId", post_controller_1.default.getPostDetail); //게시글 상세 정보 조회
router.post("/posts/:postId/verify-password", post_controller_1.default.verifyPostPassword); //게시글 상세 정보 조회
router.post("/posts/:postId/like", post_controller_1.default.likePost); // 게시글 공감하기
router.get("/posts/:postId/is-public", post_controller_1.default.checkPostIsPublic); // 게시글 공개 여부 조회
exports.default = router;

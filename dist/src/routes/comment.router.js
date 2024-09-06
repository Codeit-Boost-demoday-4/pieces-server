"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = __importDefault(require("../controllers/comment.controller"));
const router = (0, express_1.Router)();
router.post("/posts/:postId/comments", comment_controller_1.default.createComment); //댓글 생성
router.get("/posts/:postId/comments", comment_controller_1.default.getComments); //댓글 목록 조회
router.put("/comments/:commentId", comment_controller_1.default.updateComment); //댓글 수정
router.delete("/comments/:commentId", comment_controller_1.default.deleteComment); //댓글 삭제
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_service_1 = __importDefault(require("../services/comment.service"));
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */
class CommentController {
    /**
     * @swagger
     * /api/posts/{postId}/comments:
     *   post:
     *     summary: 댓글 생성
     *     tags: [Comments]
     *     parameters:
     *       - name: postId
     *         in: path
     *         required: true
     *         description: 게시글 ID
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nickname:
     *                 type: string
     *                 example: "JohnDoe"
     *               content:
     *                 type: string
     *                 example: "This is a comment"
     *               password:
     *                 type: string
     *                 example: "password123"
     *     responses:
     *       200:
     *         description: 댓글 생성 성공
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 nickname:
     *                   type: string
     *                   example: "JohnDoe"
     *                 content:
     *                   type: string
     *                   example: "This is a comment"
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   example: "2024-01-01T00:00:00Z"
     *       500:
     *         description: 서버 오류
     */
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const result = yield comment_service_1.default.createComment(postId, req.body);
                return res.status(result.status).json(result.response);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "서버 오류입니다" });
            }
        });
    }
    /**
     * @swagger
     * /api/posts/{postId}/comments:
     *   get:
     *     summary: 댓글 목록 조회
     *     tags: [Comments]
     *     parameters:
     *       - name: postId
     *         in: query
     *         required: true
     *         description: 게시글 ID
     *         schema:
     *           type: integer
     *       - name: page
     *         in: query
     *         description: 페이지 번호
     *         schema:
     *           type: integer
     *           default: 1
     *       - name: pageSize
     *         in: query
     *         description: 페이지 크기
     *         schema:
     *           type: integer
     *           default: 10
     *     responses:
     *       200:
     *         description: 댓글 목록 조회 성공
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 currentPage:
     *                   type: integer
     *                   example: 1
     *                 totalPages:
     *                   type: integer
     *                   example: 5
     *                 totalItemCount:
     *                   type: integer
     *                   example: 50
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                         example: 1
     *                       nickname:
     *                         type: string
     *                         example: "JohnDoe"
     *                       content:
     *                         type: string
     *                         example: "This is a comment"
     *                       createdAt:
     *                         type: string
     *                         format: date-time
     *                         example: "2024-01-01T00:00:00Z"
     *       500:
     *         description: 서버 오류
     */
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    page: parseInt(req.query.page, 10) || 1,
                    pageSize: parseInt(req.query.pageSize, 10) || 10,
                    postId: parseInt(req.query.postId, 10),
                };
                const result = yield comment_service_1.default.getComments(params);
                return res.status(result.status).json(result.response);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "서버 오류입니다" });
            }
        });
    }
    /**
     * @swagger
     * /api/comments/{commentId}:
     *   put:
     *     summary: 댓글 수정
     *     tags: [Comments]
     *     parameters:
     *       - name: commentId
     *         in: path
     *         required: true
     *         description: 댓글 ID
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nickname:
     *                 type: string
     *                 example: "JohnDoe"
     *               content:
     *                 type: string
     *                 example: "Updated comment"
     *               password:
     *                 type: string
     *                 example: "password123"
     *     responses:
     *       200:
     *         description: 댓글 수정 성공
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 nickname:
     *                   type: string
     *                   example: "JohnDoe"
     *                 content:
     *                   type: string
     *                   example: "Updated comment"
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   example: "2024-01-01T00:00:00Z"
     *       404:
     *         description: 댓글이 존재하지 않음
     *       403:
     *         description: 비밀번호가 틀림
     *       500:
     *         description: 서버 오류
     */
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = parseInt(req.params.commentId, 10);
                const result = yield comment_service_1.default.updateComment(commentId, req.body);
                return res.status(result.status).json(result.response);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "서버 오류입니다" });
            }
        });
    }
    /**
     * @swagger
     * /api/comments/{commentId}:
     *   delete:
     *     summary: 댓글 삭제
     *     tags: [Comments]
     *     parameters:
     *       - name: commentId
     *         in: path
     *         required: true
     *         description: 댓글 ID
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *                 example: "password123"
     *     responses:
     *       200:
     *         description: 댓글 삭제 성공
     *       404:
     *         description: 댓글이 존재하지 않음
     *       403:
     *         description: 비밀번호가 틀림
     *       500:
     *         description: 서버 오류
     */
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = parseInt(req.params.commentId, 10);
                const result = yield comment_service_1.default.deleteComment(commentId, req.body);
                return res.status(result.status).json(result.response);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "서버 오류입니다" });
            }
        });
    }
}
exports.default = new CommentController();

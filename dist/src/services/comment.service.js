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
const post_model_1 = __importDefault(require("../models/post.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
class CommentService {
    //댓글 등록
    createComment(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findByPk(postId);
            if (!post) {
                return {
                    status: 404,
                    response: { message: "게시글이 존재하지 않습니다" },
                };
            }
            try {
                const comment = yield comment_model_1.default.create({
                    postId,
                    nickname: data.nickname,
                    content: data.content,
                    password: data.password,
                });
                // 댓글 추가 후 댓글 수 업데이트
                yield this.updateCommentCount(postId);
                return {
                    status: 200,
                    response: {
                        id: comment.id,
                        nickname: comment.nickname,
                        content: comment.content,
                        createdAt: comment.createdAt,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //댓글 목록 조회
    getComments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, postId } = params;
            const where = {};
            if (postId) {
                where.postId = postId;
            }
            let order = [["createdAt", "DESC"]];
            const offset = (page - 1) * pageSize;
            const limit = pageSize;
            try {
                const { count: totalItemCount, rows: comments } = yield comment_model_1.default.findAndCountAll({
                    where,
                    order,
                    offset,
                    limit,
                    attributes: ["id", "nickname", "content", "password", "createdAt"],
                });
                const totalPages = Math.ceil(totalItemCount / pageSize);
                return {
                    status: 200,
                    response: {
                        currentPage: page,
                        totalPages,
                        totalItemCount,
                        data: comments.map((comment) => ({
                            id: comment.id,
                            nickname: comment.nickname,
                            content: comment.content,
                            password: comment.password,
                            createdAt: comment.createdAt,
                        })),
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //댓글 수정
    updateComment(commentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_model_1.default.findByPk(commentId);
            if (!comment) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            if (comment.password !== data.password) {
                return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
            }
            try {
                yield comment.update({
                    nickname: data.nickname,
                    content: data.content,
                });
                return {
                    status: 200,
                    response: {
                        id: comment.id,
                        nickname: comment.nickname,
                        content: comment.content,
                        createdAt: comment.createdAt,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //댓글 삭제
    deleteComment(commentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_model_1.default.findByPk(commentId);
            if (!comment) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            if (comment.password !== data.password) {
                return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
            }
            try {
                const postId = comment.postId;
                yield comment.destroy();
                //댓글 삭제 후 댓글 수 업데이트
                yield this.updateCommentCount(postId);
                return {
                    status: 200,
                    response: { message: "답글 삭제 성공" },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //댓글 수 업데이트
    updateCommentCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findByPk(postId);
            if (post) {
                const commentCount = yield comment_model_1.default.count({ where: { postId } });
                yield post.update({ commentCount });
            }
        });
    }
}
exports.default = new CommentService();

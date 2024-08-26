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
const tag_model_1 = __importDefault(require("../models/tag.model"));
class PostService {
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const post = yield post_model_1.default.create(data);
            // 만약 태그 데이터가 포함되어 있다면, 태그를 연결
            if (data.tags && data.tags.length > 0) {
                const tags = yield tag_model_1.default.findAll({
                    where: {
                        text: data.tags,
                    },
                });
                yield post.setTags(tags);
            }
            // 생성된 포스트의 데이터를 가공하여 반환
            const postWithTags = yield post_model_1.default.findByPk(post.id, {
                include: [{ model: tag_model_1.default, as: "tags" }],
            });
            // 생성된 포스트의 데이터를 가공하여 반환
            const response = {
                id: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.id,
                groupId: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.groupId,
                nickname: "string",
                title: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.title,
                content: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.content,
                imageUrl: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.imageUrl,
                tags: ((_a = postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => tag.text)) || [],
                location: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.location,
                moment: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.moment,
                isPublic: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.isPublic,
                likeCount: 0,
                commentCount: 0,
                createdAt: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.createdAt,
            };
            return response;
        });
    }
    getPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const publicPosts = yield post_model_1.default.findAll({
                where: { isPublic: true },
                attributes: [
                    "id",
                    "groupId",
                    "nickname",
                    "title",
                    "content",
                    "imageUrl",
                    "tags",
                    "location",
                    "moment",
                    "isPublic",
                    "likeCount",
                    "commentCount",
                    "createdAt",
                ],
            });
            const privatePosts = yield post_model_1.default.findAll({
                where: { isPublic: false },
                attributes: [
                    "id",
                    "groupId",
                    "nickname",
                    "title",
                    "content",
                    "imageUrl",
                    "tags",
                    "location",
                    "moment",
                    "isPublic",
                    "likeCount",
                    "commentCount",
                    "createdAt",
                ],
            });
            return { publicPosts, privatePosts };
        });
    }
}
exports.default = new PostService();

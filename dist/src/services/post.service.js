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
const sequelize_1 = require("sequelize");
const post_model_1 = __importDefault(require("../models/post.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const postTag_model_1 = __importDefault(require("../models/postTag.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const group_model_1 = __importDefault(require("../models/group.model"));
const badge_service_1 = __importDefault(require("./badge.service"));
class PostService {
    constructor() {
        this.badgeService = new badge_service_1.default();
    }
    // 게시물 존재 여부 확인 및 비밀번호 검증 로직을 추출한 함수
    validatePost(postId, postPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findByPk(postId);
            if (!post) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            if (postPassword && post.postPassword !== postPassword) {
                return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
            }
            return { status: 200, response: { post } };
        });
    }
    //게시글 공감 수와 댓글 수 조회
    getPostDetails(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findOne({
                where: { id: postId }
            });
            if (post) {
                const likeCount = post.likeCount;
                const commentCount = yield comment_model_1.default.count({ where: { postId } });
                return { likeCount, commentCount };
            }
            return { likeCount: 0, commentCount: 0 };
        });
    }
    //게시글 생성
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const post = yield post_model_1.default.create({
                    nickname: data.nickname,
                    groupId: data.groupId,
                    title: data.title,
                    content: data.content,
                    postPassword: data.postPassword,
                    imageUrl: data.imageUrl,
                    location: data.location,
                    moment: data.moment,
                    isPublic: data.isPublic,
                });
                if (data.tags && data.tags.length > 0) {
                    //기존 태그 찾기 또는 새로 생성
                    const tags = yield Promise.all(data.tags.map((text) => __awaiter(this, void 0, void 0, function* () {
                        const [tag] = yield tag_model_1.default.findOrCreate({ where: { text } });
                        return tag;
                    })));
                    //PostTag 관계 생성
                    yield postTag_model_1.default.bulkCreate(tags.map((tag) => ({ postId: post.id, tagId: tag.id })));
                }
                const { likeCount, commentCount } = yield this.getPostDetails(post.id);
                const postWithTags = yield post_model_1.default.findByPk(post.id, {
                    include: [{ model: tag_model_1.default, as: "tags" }],
                });
                //7일 연속 추억 등록 조건 검사 및 뱃지 부여
                const consecutivePostsMet = yield this.badgeService.checkConsecutivePosts(data.groupId);
                if (consecutivePostsMet) {
                    yield this.badgeService.awardBadge(data.groupId, 1);
                }
                //추억 수 20개 이상 등록 조건 검사 및 뱃지 부여
                const minPostsMet = yield this.badgeService.checkMinPosts(data.groupId);
                if (minPostsMet) {
                    yield this.badgeService.awardBadge(data.groupId, 2);
                    //그룹의 뱃지 수 업데이트
                    const group = yield group_model_1.default.findByPk(data.groupId);
                    if (group) {
                        yield group.calculateBadgeCount();
                    }
                }
                //그룹의 게시글 수 업데이트
                const group = yield group_model_1.default.findByPk(data.groupId);
                if (group) {
                    yield group.calculatePostCount();
                }
                return {
                    status: 201,
                    response: {
                        id: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.id,
                        groupId: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.groupId,
                        nickname: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.nickname,
                        title: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.title,
                        content: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.content,
                        imageUrl: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.imageUrl,
                        tags: ((_a = postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => tag.text)) || [],
                        location: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.location,
                        moment: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.moment,
                        isPublic: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.isPublic,
                        likeCount,
                        commentCount,
                        createdAt: postWithTags === null || postWithTags === void 0 ? void 0 : postWithTags.createdAt,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다." } };
            }
        });
    }
    //게시글 목록 조회
    getPosts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, sortBy, keyword, isPublic, groupId } = params;
            const offset = (page - 1) * pageSize;
            //정렬 기준 설정
            let order = [];
            switch (sortBy) {
                case 'latest':
                    order = [['createdAt', 'DESC']];
                    break;
                case 'mostCommented':
                    order = [['commentCount', 'DESC']];
                    break;
                case 'mostLiked':
                    order = [['likeCount', 'DESC']];
                    break;
                default:
                    order = [['createdAt', 'DESC']];
            }
            //검색 조건 설정
            const searchCondition = keyword
                ? {
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { tags: { [sequelize_1.Op.like]: `%${keyword}%` } },
                    ],
                }
                : {};
            //쿼리 생성
            const query = {
                where: Object.assign(Object.assign({}, searchCondition), { isPublic,
                    groupId }),
                order,
                limit: pageSize,
                offset,
                attributes: [
                    'id',
                    'nickname',
                    'title',
                    'imageUrl',
                    'location',
                    'moment',
                    'isPublic',
                    'likeCount',
                    'commentCount',
                    'createdAt',
                ],
                include: [{ model: tag_model_1.default, as: 'tags', attributes: ['text'] }],
            };
            //총 게시글 수 조회
            const totalItemCount = yield post_model_1.default.count({
                where: Object.assign(Object.assign({}, searchCondition), { isPublic,
                    groupId }),
            });
            //게시글 목록 조회
            const posts = yield post_model_1.default.findAll(query);
            //총 페이지 수 계산
            const totalPages = Math.ceil(totalItemCount / pageSize);
            return {
                currentPage: page,
                totalPages,
                totalItemCount,
                data: posts.map(post => ({
                    id: post.id,
                    nickname: post.nickname,
                    title: post.title,
                    imageUrl: post.imageUrl,
                    tags: post.tags ? post.tags.map(tag => tag.text) : [], // `tags`가 undefined일 경우 빈 배열로 처리
                    location: post.location,
                    moment: post.moment,
                    isPublic: post.isPublic,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                    createdAt: post.createdAt,
                })),
            };
        });
    }
    //게시글 수정
    updatePost(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const postValidation = yield this.validatePost(postId, data.postPassword);
            if (postValidation.status !== 200)
                return postValidation;
            const { post } = postValidation.response;
            if (!post) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            try {
                yield post.update({
                    nickname: data.nickname,
                    title: data.title,
                    content: data.content,
                    postPassword: data.postPassword,
                    imageUrl: data.imageUrl,
                    location: data.location,
                    moment: data.moment,
                    isPublic: data.isPublic,
                });
                if (data.tags && data.tags.length > 0) {
                    const tags = yield Promise.all(data.tags.map((text) => __awaiter(this, void 0, void 0, function* () {
                        const [tag] = yield tag_model_1.default.findOrCreate({ where: { text } });
                        return tag;
                    })));
                    //기존 태그 관계 제거 후 새로운 태그 관계 생성
                    yield postTag_model_1.default.destroy({ where: { postId: post.id } });
                    yield postTag_model_1.default.bulkCreate(tags.map((tag) => ({ postId: post.id, tagId: tag.id })), { ignoreDuplicates: true });
                }
                const { likeCount, commentCount } = yield this.getPostDetails(post.id);
                const updatedPost = yield post_model_1.default.findByPk(post.id, {
                    include: [{ model: tag_model_1.default, as: "tags" }],
                });
                return {
                    status: 200,
                    response: {
                        id: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.id,
                        groupId: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.groupId,
                        nickname: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.nickname,
                        title: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.title,
                        content: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.content,
                        imageUrl: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.imageUrl,
                        tags: ((_a = updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => tag.text)) || [],
                        location: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.location,
                        moment: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.moment,
                        isPublic: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.isPublic,
                        likeCount,
                        commentCount,
                        createdAt: updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.createdAt,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //게시글 삭제
    deletePost(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const postValidation = yield this.validatePost(postId, data.postPassword);
            if (postValidation.status !== 200)
                return postValidation;
            const { post } = postValidation.response;
            if (!post) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            try {
                //삭제될 게시글과 관련된 태그 가져오기
                const postTags = yield postTag_model_1.default.findAll({ where: { postId } });
                const tagIds = postTags.map((postTag) => postTag.tagId);
                yield post.destroy();
                //각 태그가 다른 게시글에서도 사용되는지 확인 후, 사용되지 않는 태그 삭제
                for (const tagId of tagIds) {
                    const postTagCount = yield postTag_model_1.default.count({ where: { tagId } });
                    if (postTagCount === 0) {
                        yield tag_model_1.default.destroy({ where: { id: tagId } });
                    }
                }
                //그룹의 게시글 수 업데이트
                const group = yield group_model_1.default.findByPk(post.groupId);
                if (group) {
                    yield group.calculatePostCount();
                }
                return { status: 200, response: { message: "게시글 삭제 성공" } };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //게시글 상세 정보 조회
    getPostDetail(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const post = yield post_model_1.default.findByPk(postId, {
                include: [{ model: tag_model_1.default, as: "tags" }],
            });
            if (!post) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            try {
                const { likeCount, commentCount } = yield this.getPostDetails(post.id);
                return {
                    status: 200,
                    response: {
                        id: post.id,
                        groupId: post.groupId,
                        nickname: post.nickname,
                        title: post.title,
                        imageUrl: post.imageUrl,
                        tags: ((_a = post.tags) === null || _a === void 0 ? void 0 : _a.map((tag) => tag.text)) || [],
                        location: post.location,
                        moment: post.moment,
                        isPublic: post.isPublic,
                        likeCount,
                        commentCount,
                        createdAt: post.createdAt,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    //게시글 조회 권한 확인하기
    verifyPostPassword(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const postValidation = yield this.validatePost(postId, data.postPassword);
            if (postValidation.status !== 200)
                return postValidation;
            try {
                return {
                    status: 200,
                    response: { message: "비밀번호가 확인되었습니다" },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
    // 게시글에 공감하기
    likePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findByPk(postId);
            if (!post)
                throw new Error("게시글을 찾을 수 없습니다.");
            // 공감 수 증가
            post.likeCount += 1;
            yield post.save();
            const badgeId = 5;
            // 공감 개수 조건을 검사
            const minPostLikesMet = yield this.badgeService.checkMinPostLikes(postId);
            // 조건이 만족되면 뱃지를 부여
            if (minPostLikesMet && post.groupId) {
                yield this.badgeService.awardBadge(post.groupId, badgeId);
                // 그룹의 뱃지 수 업데이트
                const group = yield group_model_1.default.findByPk(post.groupId);
                if (group) {
                    yield group.calculateBadgeCount();
                }
            }
            return post;
        });
    }
    //게시글 공개 여부 확인
    checkPostIsPublic(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_model_1.default.findByPk(postId, {
                attributes: ["id", "isPublic"],
            });
            if (!post) {
                return { status: 404, response: { message: "존재하지 않습니다" } };
            }
            try {
                return {
                    status: 200,
                    response: {
                        id: post.id,
                        isPublic: post.isPublic,
                    },
                };
            }
            catch (error) {
                console.error(error);
                return { status: 400, response: { message: "잘못된 요청입니다" } };
            }
        });
    }
}
exports.default = new PostService();

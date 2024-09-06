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
const post_service_1 = __importDefault(require("../services/post.service"));
const group_service_1 = __importDefault(require("../services/group.service"));
class PostController {
    /**
     * @swagger
     * /api/groups/{groupId}/posts:
     *   post:
     *     summary: 게시글 작성
     *     tags:
     *       - Posts
     *     parameters:
     *       - in: path
     *         name: groupId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the group where the post will be created
     *         example: 1
     *     requestBody:
     *       description: The data required to create a new post
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nickname
     *               - title
     *               - postPassword
     *               - content
     *               - isPublic
     *             properties:
     *               nickname:
     *                 type: string
     *                 description: Nickname of the user creating the post
     *                 example: "user123"
     *               title:
     *                 type: string
     *                 description: Title of the post
     *                 example: "My First Post"
     *               postPassword:
     *                 type: string
     *                 description: Password to protect the post
     *                 example: "1234"
     *               groupPassword:
     *                 type: string
     *                 description: Password for group verification
     *                 example: "password123"
     *               imageUrl:
     *                 type: string
     *                 description: URL of the image associated with the post
     *                 example: "http://example.com/image.jpg"
     *               content:
     *                 type: string
     *                 description: Content of the post
     *                 example: "This is the content of the post."
     *               location:
     *                 type: string
     *                 description: Location related to the post
     *                 example: "Seoul, Korea"
     *               moment:
     *                 type: string
     *                 format: date-time
     *                 description: Date and time when the event in the post occurred
     *                 example: "2024-08-27T14:00:00Z"
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: List of tags associated with the post
     *                 example: ["tag1", "tag2"]
     *               isPublic:
     *                 type: boolean
     *                 description: Indicates whether the post is public
     *                 example: true
     *     responses:
     *       201:
     *         description: Successfully created the post
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 id:
     *                   type: integer
     *                   description: ID of the created post
     *                   example: 1
     *                 groupId:
     *                   type: integer
     *                   description: ID of the group where the post was created
     *                   example: 1
     *                 nickname:
     *                   type: string
     *                   description: Nickname of the user who created the post
     *                   example: "user123"
     *                 title:
     *                   type: string
     *                   description: Title of the post
     *                   example: "My First Post"
     *                 content:
     *                   type: string
     *                   description: Content of the post
     *                   example: "This is the content of the post."
     *                 imageUrl:
     *                   type: string
     *                   description: URL of the image associated with the post
     *                   example: "http://example.com/image.jpg"
     *                 tags:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: List of tags associated with the post
     *                   example: ["tag1", "tag2"]
     *                 location:
     *                   type: string
     *                   description: Location related to the post
     *                   example: "Seoul, Korea"
     *                 moment:
     *                   type: string
     *                   format: date-time
     *                   description: Date and time when the event in the post occurred
     *                   example: "2024-08-27T14:00:00Z"
     *                 isPublic:
     *                   type: boolean
     *                   description: Indicates whether the post is public
     *                   example: true
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   description: Date and time when the post was created
     *                   example: "2024-08-27T14:00:00Z"
     *       400:
     *         description: Invalid request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Bad Request"
     *       403:
     *         description: Forbidden. Group password is incorrect
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Group password is incorrect."
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Server error."
     */
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupId } = req.params;
            const { groupPassword } = req.body;
            try {
                // 그룹 비밀번호 검증
                const isValid = yield group_service_1.default.verifyGroupPassword(parseInt(groupId), groupPassword);
                if (!isValid) {
                    return res.status(403).json({ message: "그룹 비밀번호가 틀렸습니다" });
                }
                const result = yield post_service_1.default.createPost(Object.assign(Object.assign({}, req.body), { groupId: parseInt(groupId) }));
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
     * /api/groups/{groupId}/posts:
     *   get:
     *     summary: 게시글 목록 조회
     *     tags:
     *       - Posts
     *     description: 게시글 목록을 페이지네이션 및 정렬 기준으로 조회합니다.
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: 조회할 페이지 번호
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           default: 10
     *         description: 페이지당 게시글 수
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [latest, mostCommented, mostLiked]
     *           default: latest
     *         description: 정렬 기준
     *       - in: query
     *         name: keyword
     *         schema:
     *           type: string
     *         description: 검색 키워드
     *       - in: query
     *         name: isPublic
     *         schema:
     *           type: boolean
     *         description: 공개 여부
     *       - in: query
     *         name: groupId
     *         schema:
     *           type: integer
     *         required: true
     *         description: 그룹 ID (필수)
     *     responses:
     *       200:
     *         description: 게시글 목록이 성공적으로 반환됨
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 currentPage:
     *                   type: integer
     *                 totalPages:
     *                   type: integer
     *                 totalItemCount:
     *                   type: integer
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       nickname:
     *                         type: string
     *                       title:
     *                         type: string
     *                       imageUrl:
     *                         type: string
     *                       tags:
     *                         type: array
     *                         items:
     *                           type: string
     *                       location:
     *                         type: string
     *                       moment:
     *                         type: string
     *                         format: date-time
     *                       isPublic:
     *                         type: boolean
     *                       likeCount:
     *                         type: integer
     *                       commentCount:
     *                         type: integer
     *                       createdAt:
     *                         type: string
     *                         format: date-time
     *       400:
     *         description: 그룹 아이디가 제공되지 않음
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "그룹 아이디를 입력하세요."
     *       500:
     *         description: 서버 오류
     */
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 요청 쿼리에서 파라미터 추출
                const { page = 1, pageSize = 10, sortBy = 'latest', keyword, isPublic, groupId } = req.query;
                // groupId가 제공되지 않았을 경우 에러 반환
                if (!groupId) {
                    return res.status(400).json({ message: '그룹 아이디를 입력하세요.' });
                }
                // 파라미터 변환
                const pageNumber = parseInt(page, 10);
                const pageSizeNumber = parseInt(pageSize, 10);
                const sortByString = sortBy;
                const isPublicBoolean = isPublic === 'true' ? true : isPublic === 'false' ? false : undefined;
                const groupIdNumber = groupId ? parseInt(groupId, 10) : undefined;
                const result = yield post_service_1.default.getPosts({
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    sortBy: sortByString,
                    keyword: keyword,
                    isPublic: isPublicBoolean,
                    groupId: groupIdNumber
                });
                res.status(200).json(result);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        });
    }
    /**
   * @swagger
   * /api/posts/{postId}:
   *   get:
   *     summary: 게시글 상세 정보 조회
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: path
   *         name: postId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 조회할 post의 id
   *         example: 1
   *     responses:
   *       200:
   *         description: 성공적으로 조회했습니다.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: post의 id
   *                   example: 1
   *                 nickname:
   *                   type: string
   *                   description: post를 작성한 사용자의 닉네임
   *                   example: "user123"
   *                 title:
   *                   type: string
   *                   description: post의 제목
   *                   example: "Sample Post Title"
   *                 content:
   *                   type: string
   *                   description: post의 내용
   *                   example: "This is the content of the post."
   *                 imageUrl:
   *                   type: string
   *                   description: image URL
   *                   example: "http://example.com/image.jpg"
   *                 tags:
   *                   type: array
   *                   items:
   *                     type: string
   *                   description: Tags
   *                   example: ["tag1", "tag2"]
   *                 location:
   *                   type: string
   *                   description: 위치
   *                   example: "서울"
   *                 moment:
   *                   type: string
   *                   format: date-time
   *                   description: post를 작성한 시간
   *                   example: "2024-08-27T14:00:00Z"
   *                 isPublic:
   *                   type: boolean
   *                   description: post의 공개 여부
   *                   example: true
   *                 likeCount:
   *                   type: integer
   *                   description: post 공감 개수
   *                   example: 10
   *                 commentCount:
   *                   type: integer
   *                   description: post 댓글 개수
   *                   example: 5
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   description: post를 작성한 시간
   *                   example: "2024-08-27T14:00:00Z"
   *       404:
   *         description: Post를 찾을 수 없습니다.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Post를 찾을 수 없습니다."
   *       500:
   *         description: 서버 오류
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "서버 오류입니다"
   */
    getPostDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const result = yield post_service_1.default.getPostDetail(postId);
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
     * /api/posts/{postId}:
     *   put:
     *     summary: 게시글 수정
     *     tags:
     *       - Posts
     *     parameters:
     *       - in: path
     *         name: postId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the post to update
     *         example: 1
     *     requestBody:
     *       description: The data to update the post
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nickname
     *               - title
     *               - content
     *               - postPassword
     *               - isPublic
     *             properties:
     *               nickname:
     *                 type: string
     *                 description: Nickname of the user updating the post
     *                 example: "user123"
     *               title:
     *                 type: string
     *                 description: New title of the post
     *                 example: "Updated Post Title"
     *               postPassword:
     *                 type: string
     *                 description: Password to protect the post
     *                 example: "1234"
     *               imageUrl:
     *                 type: string
     *                 description: URL of the image associated with the post
     *                 example: "http://example.com/image.jpg"
     *               content:
     *                 type: string
     *                 description: New content of the post
     *                 example: "Updated content of the post."
     *               location:
     *                 type: string
     *                 description: New location related to the post
     *                 example: "Busan, Korea"
     *               moment:
     *                 type: string
     *                 format: date-time
     *                 description: Updated date and time when the event in the post occurred
     *                 example: "2024-08-28"
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: List of new tags associated with the post
     *                 example: ["tag3", "tag4"]
     *               isPublic:
     *                 type: boolean
     *                 description: Indicates whether the post should be public
     *                 example: false
     *     responses:
     *       200:
     *         description: Successfully updated the post
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 id:
     *                   type: integer
     *                   description: ID of the updated post
     *                   example: 1
     *                 groupId:
     *                   type: integer
     *                   description: ID of the group where the post was updated
     *                   example: 1
     *                 nickname:
     *                   type: string
     *                   description: Nickname of the user who updated the post
     *                   example: "user123"
     *                 title:
     *                   type: string
     *                   description: Updated title of the post
     *                   example: "Updated Post Title"
     *                 content:
     *                   type: string
     *                   description: Updated content of the post
     *                   example: "Updated content of the post."
     *                 imageUrl:
     *                   type: string
     *                   description: URL of the image associated with the post
     *                   example: "http://example.com/image.jpg"
     *                 tags:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: List of tags associated with the post
     *                   example: ["tag3", "tag4"]
     *                 location:
     *                   type: string
     *                   description: Updated location related to the post
     *                   example: "Busan, Korea"
     *                 moment:
     *                   type: string
     *                   format: date-time
     *                   description: Updated date and time when the event in the post occurred
     *                   example: "2024-08-28"
     *                 isPublic:
     *                   type: boolean
     *                   description: Indicates whether the post is public
     *                   example: false
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   description: Date and time when the post was created
     *                   example: "2024-08-27T14:00:00Z"
     *       400:
     *         description: Invalid request data
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Invalid request data"
     *       403:
     *         description: Forbidden. Incorrect post password
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Incorrect password"
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Server error"
     */
    // 게시글 수정
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const result = yield post_service_1.default.updatePost(postId, req.body);
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
     * /api/posts/{postId}:
     *   delete:
     *     summary: 게시글 삭제
     *     tags:
     *       - Posts
     *     parameters:
     *       - in: path
     *         name: postId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the post to delete
     *         example: 1
     *     requestBody:
     *       description: Password for deleting the post
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               postPassword:
     *                 type: string
     *                 description: Password to confirm deletion
     *                 example: "1234"
     *     responses:
     *       200:
     *         description: Successfully deleted the post
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *       400:
     *         description: Invalid request data
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Invalid request data"
     *       403:
     *         description: Forbidden. Incorrect post password
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Incorrect password"
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Server error"
     */
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const result = yield post_service_1.default.deletePost(postId, req.body);
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
     * /api/posts/{postId}/verify-password:
     *   post:
     *     summary: 게시글 비밀번호 확인
     *     tags:
     *       - Posts
     *     parameters:
     *       - in: path
     *         name: postId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the post to verify password for
     *         example: 1
     *     requestBody:
     *       description: Password for the post
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               postPassword:
     *                 type: string
     *                 description: Password to access the post
     *                 example: "1234"
     *     responses:
     *       200:
     *         description: Password is correct
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 message:
     *                   type: string
     *                   example: "Password is correct"
     *       403:
     *         description: Incorrect password
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Incorrect password"
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Server error"
     */
    verifyPostPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const result = yield post_service_1.default.verifyPostPassword(postId, req.body);
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
     * /api/posts/{postId}/like:
     *   post:
     *     summary: 게시글 공감하기
     *     tags:
     *       - Posts
     *     parameters:
     *       - in: path
     *         name: postId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the post to like
     *         example: 1
     *     responses:
     *       200:
     *         description: Successfully liked the post
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "success"
     *                 likeCount:
     *                   type: integer
     *                   description: Updated number of likes on the post
     *                   example: 11
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Server error"
     */
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId);
                const post = yield post_service_1.default.likePost(postId);
                if (!post) {
                    return res.status(404).json({ message: "Post not found" });
                }
                return res.status(200).json({
                    status: "success",
                    likeCount: post.likeCount,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
            }
        });
    }
    /**
     * @swagger
     * /api/posts/{postId}/is-public:
     *   get:
     *     summary: 게시글 공개 여부 조회
     *     tags:
     *       - Posts
     *     parameters:
     *       - in: path
     *         name: postId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the post to check
     *         example: 1
     *     responses:
     *       200:
     *         description: Successfully retrieved the post's public status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 isPublic:
     *                   type: boolean
     *                   description: Indicates whether the post is public
     *                   example: true
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Server error"
     */
    checkPostIsPublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const result = yield post_service_1.default.checkPostIsPublic(postId);
                return res.status(result.status).json(result.response);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "서버 오류입니다" });
            }
        });
    }
}
exports.default = new PostController();

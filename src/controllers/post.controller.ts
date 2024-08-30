import { Request, Response } from "express";
import PostService from "../services/post.service";
import GroupService from "../services/group.service";

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
  async createPost(req: Request, res: Response) {
    const { groupId } = req.params;
    const { groupPassword } = req.body;

    try {
      // 그룹 비밀번호 검증
      const isValid = await GroupService.verifyGroupPassword(parseInt(groupId), groupPassword);
      if (!isValid) {
        return res.status(403).json({ message: "그룹 비밀번호가 틀렸습니다" });
      }

      const result = await PostService.createPost({ ...req.body, groupId: parseInt(groupId) });
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }

/**
 * @swagger
 * /api/groups/{groupId}/posts:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of posts per page
 *       - in: query
 *         name: sortBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [latest, mostCommented, mostLiked]
 *           example: latest
 *         description: The criteria to sort the posts
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: "example"
 *         description: Keyword to search in the post title
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Whether to filter posts based on their public status
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the group to filter posts
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 10
 *                 totalItemCount:
 *                   type: integer
 *                   description: Total number of posts
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the post
 *                         example: 1
 *                       nickname:
 *                         type: string
 *                         description: Nickname of the user who created the post
 *                         example: "user123"
 *                       title:
 *                         type: string
 *                         description: Title of the post
 *                         example: "My First Post"
 *                       imageUrl:
 *                         type: string
 *                         description: URL of the image associated with the post
 *                         example: "http://example.com/image.jpg"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: List of tags associated with the post
 *                         example: ["tag1", "tag2"]
 *                       location:
 *                         type: string
 *                         description: Location related to the post
 *                         example: "Seoul, Korea"
 *                       moment:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the event in the post occurred
 *                         example: "2024-08-27T14:00:00Z"
 *                       isPublic:
 *                         type: boolean
 *                         description: Indicates whether the post is public
 *                         example: true
 *                       likeCount:
 *                         type: integer
 *                         description: Number of likes on the post
 *                         example: 10
 *                       commentCount:
 *                         type: integer
 *                         description: Number of comments on the post
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the post was created
 *                         example: "2024-08-27T14:00:00Z"
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
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
  async getPosts(req: Request, res: Response) {
    try {
      const sortBy = (req.query.sortBy as string) || "latest";

      if (!["latest", "mostCommented", "mostLiked"].includes(sortBy)) {
        return res.status(400).json({ message: "잘못된 정렬 기준입니다" });
      }

      const params = {
        page: parseInt(req.query.page as string, 10) || 1,
        pageSize: parseInt(req.query.pageSize as string, 10) || 10,
        sortBy: sortBy as "latest" | "mostCommented" | "mostLiked",
        keyword: req.query.keyword as string,
        isPublic: req.query.isPublic === "true",
        groupId: req.query.groupId
          ? parseInt(req.query.groupId as string, 10)
          : undefined,
      };
      const result = await PostService.getPosts(params);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
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
 *                 example: "2024-08-28T15:00:00Z"
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
 *                   example: "2024-08-28T15:00:00Z"
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
  async updatePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.updatePost(postId, req.body);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
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

  async deletePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.deletePost(postId, req.body);

      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
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
 *         description: ID of the post to retrieve
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the post
 *                   example: 1
 *                 nickname:
 *                   type: string
 *                   description: Nickname of the user who created the post
 *                   example: "user123"
 *                 title:
 *                   type: string
 *                   description: Title of the post
 *                   example: "Sample Post Title"
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
 *                   description: Tags associated with the post
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
 *                 likeCount:
 *                   type: integer
 *                   description: Number of likes on the post
 *                   example: 10
 *                 commentCount:
 *                   type: integer
 *                   description: Number of comments on the post
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time when the post was created
 *                   example: "2024-08-27T14:00:00Z"
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
  async getPostDetail(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.getPostDetail(postId);

      // PostService로부터 받은 상태 코드와 응답을 사용하여 클라이언트에 반환
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      // 에러 발생 시, 500 내부 서버 오류를 반환
      return res.status(500).json({ message: "서버 오류입니다" });
    }
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
  async verifyPostPassword(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.verifyPostPassword(postId, req.body);

      // PostService로부터 받은 상태 코드와 응답을 사용하여 클라이언트에 반환
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      // 에러 발생 시, 500 내부 서버 오류를 반환
      return res.status(500).json({ message: "서버 오류입니다" });
    }
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
async likePost(req: Request, res: Response) {
  try {
    const postId = parseInt(req.params.postId);
    
    // 게시글 공감하기 서비스 호출
    const post = await PostService.likePost(postId);

    if (!post) {
      // 게시글이 없을 경우 404 응답
      return res.status(404).json({ message: "Post not found" });
    }

    // 공감 성공 시 응답
    return res.status(200).json({
      status: "success",
      likeCount: post.likeCount,
    });
  } catch (error) {
    console.error(error);
    // 서버 오류 시 응답
    return res.status(500).json({ message: "Server error" });
  }
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
  async checkPostIsPublic(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.checkPostIsPublic(postId);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }
}

export default new PostController();

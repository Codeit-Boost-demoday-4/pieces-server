import { Request, Response } from "express";
import PostService from "../services/post.service";
import GroupService from "../services/group.service";

class PostController {
/**
 * @swagger
 * /api/groups/{groupId}/posts:
 *   post:
 *     summary: Create a new post
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


  // 게시글 조회
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

  // 게시글 삭제
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

  //게시글 상세 정보 조회
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

  //게시글 상세 정보 조회
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

  // 게시글 공감하기
  async likePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await PostService.likePost(postId);
      return res.status(result.status).json(result.response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류입니다" });
    }
  }

  // 게시글 공개 여부 조회
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

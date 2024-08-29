import { Request, Response } from "express";
import PostService from "../services/post.service";

class PostController {
  // 게시글 생성
  async createPost(req: Request, res: Response) {
    try {
      const result = await PostService.createPost(req.body);
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
}

export default new PostController();

import { Op } from "sequelize";
import Post from "../models/post.model";
import Comment from "../models/comment.model";

class CommentService {
  //댓글 등록
  async createComment(
    postId: number,
    data: {
      nickname: string;
      content: string;
      password: string;
    }
  ) {
    /*
    try {
      const comment = await Comment.create({
        
        postId,
        nickname: data.nickname,
        content: data.content,
        password: data.password,
        
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
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
    */
  }
}

export default new CommentService();

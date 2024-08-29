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
    const post = await Post.findByPk(postId);

    if (!post) {
      return { status: 404, response: { message: "그룹이 존재하지 않습니다" } };
    }

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
  }

  //댓글 목록 조회
  async getComments(params: {
    page: number;
    pageSize: number;
    groupId?: number;
  }) {
    const { page, pageSize, groupId } = params;

    const where: any = {};

    if (groupId) {
      where.groupId = groupId;
    }

    let order: any[] = [["createdAt", "DESC"]];

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
      const { count: totalItemCount, rows: comments } =
        await Comment.findAndCountAll({
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
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //댓글 수정
  async updateComment(
    commentId: number,
    data: {
      nickname: string;
      content: string;
      password: string;
    }
  ) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    if (comment.password !== data.password) {
      return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
    }

    try {
      await comment.update({
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
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //댓글 삭제
  async deleteComment(
    commentId: number,
    data: {
      password: string;
    }
  ) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    if (comment.password !== data.password) {
      return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
    }

    try {
      await comment.destroy();
      return {
        status: 200,
        response: { message: "답글 삭제 성공" },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }
}

export default new CommentService();

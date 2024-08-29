import { Op } from "sequelize";
import Post from "../models/post.model";
import PostLike from "../models/postLike.model";
import Tag from "../models/tag.model";
import Group from "../models/group.model";

class PostService {
  //게시글 생성
  async createPost(data: {
    nickname: string;
    groupId: number;
    title: string;
    content: string;
    postPassword: string;
    groupPassword: string;
    imageUrl?: string;
    tags?: string[]; // 태그 추가
    location?: string;
    moment?: Date;
    isPublic: boolean;
  }) {
    const group = await Group.findByPk(data.groupId);

    if (!group) {
      return { status: 404, response: { message: "그룹이 존재하지 않습니다" } };
    }

    if (group.passwordHash !== data.groupPassword) {
      return {
        status: 403,
        response: { message: "그룹 비밀번호가 틀렸습니다" },
      };
    }

    try {
      const post = await Post.create({
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
        const tags = await Tag.findAll({
          where: {
            text: data.tags,
          },
        });
        //await post.setTags(tags);
      }

      const postWithTags = await Post.findByPk(post.id, {
        include: [{ model: Tag, as: "tags" }],
      });

      return {
        status: 200,
        response: {
          id: postWithTags?.id,
          groupId: postWithTags?.groupId,
          nickname: postWithTags?.nickname,
          title: postWithTags?.title,
          content: postWithTags?.content,
          imageUrl: postWithTags?.imageUrl,
          //tags: postWithTags?.tags?.map((tag) => tag.text) || [],
          location: postWithTags?.location,
          moment: postWithTags?.moment,
          isPublic: postWithTags?.isPublic,
          likeCount: 0,
          commentCount: 0,
          createdAt: postWithTags?.createdAt,
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  // 게시글 조회
  async getPosts(params: {
    page: number;
    pageSize: number;
    sortBy: "latest" | "mostCommented" | "mostLiked";
    keyword?: string;
    isPublic?: boolean;
    groupId?: number;
  }) {
    const { page, pageSize, sortBy, keyword, isPublic, groupId } = params;

    const where: any = {};

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    if (groupId) {
      where.groupId = groupId;
    }

    let order: any[] = [["createdAt", "DESC"]];
    if (sortBy === "mostCommented") {
      order = [["commentCount", "DESC"]];
    } else if (sortBy === "mostLiked") {
      order = [["likeCount", "DESC"]];
    }

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
      const { count: totalItemCount, rows: posts } = await Post.findAndCountAll(
        {
          where,
          include: [{ model: Tag, as: "tags" }],
          order,
          offset,
          limit,
          attributes: [
            "id",
            "nickname",
            "title",
            "imageUrl",
            "tags",
            "location",
            "moment",
            "isPublic",
            "likeCount",
            "commentCount",
            "createdAt",
          ],
        }
      );

      const totalPages = Math.ceil(totalItemCount / pageSize);

      return {
        status: 200,
        response: {
          currentPage: page,
          totalPages,
          totalItemCount,
          data: posts.map((post) => ({
            id: post.id,
            nickname: post.nickname,
            title: post.title,
            imageUrl: post.imageUrl,
            //tags: post.tags?.map((tag) => tag.text) || [],
            location: post.location,
            moment: post.moment,
            isPublic: post.isPublic,
            //likeCount: post.likeCount,
            //commentCount: post.commentCount,
            createdAt: post.createdAt,
          })),
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  // 게시글 수정
  async updatePost(
    postId: number,
    data: {
      nickname: string;
      title: string;
      content: string;
      postPassword: string;
      imageUrl?: string;
      tags?: string[];
      location?: string;
      moment?: Date;
      isPublic: boolean;
    }
  ) {
    const post = await Post.findByPk(postId);

    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    if (post.postPassword !== data.postPassword) {
      return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
    }

    try {
      await post.update({
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
        const tags = await Tag.findAll({
          where: {
            text: data.tags,
          },
        });
        //await post.setTags(tags);
      }

      const updatedPost = await Post.findByPk(post.id, {
        include: [{ model: Tag, as: "tags" }],
      });

      return {
        status: 200,
        response: {
          id: updatedPost?.id,
          groupId: updatedPost?.groupId,
          nickname: updatedPost?.nickname,
          title: updatedPost?.title,
          content: updatedPost?.content,
          imageUrl: updatedPost?.imageUrl,
          //tags: updatedPost?.tags?.map((tag) => tag.text) || [],
          location: updatedPost?.location,
          moment: updatedPost?.moment,
          isPublic: updatedPost?.isPublic,
          likeCount: 0,
          commentCount: 0,
          createdAt: updatedPost?.createdAt,
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  // 게시글 삭제
  async deletePost(postId: number, data: { postPassword: string }) {
    const post = await Post.findByPk(postId);

    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    if (post.postPassword !== data.postPassword) {
      return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
    }

    try {
      await post.destroy();
      return { status: 200, response: { message: "게시글 삭제 성공" } };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //게시글 상세 정보 조회
  async getPostDetail(postId: number) {
    const post = await Post.findByPk(postId);

    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    try {
      return {
        status: 200,
        response: {
          id: post.id,
          groupId: post.groupId,
          nickname: post.nickname,
          title: post.title,
          imageUrl: post.imageUrl,
          //tags: post.tags?.map((tag) => tag.text) || [],
          location: post.location,
          moment: post.moment,
          isPublic: post.isPublic,
          //likeCount: post.likeCount,
          //commentCount: post.commentCount,
          createdAt: post.createdAt,
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //게시글 조회 권한 확인하기
  async verifyPostPassword(postId: number, data: { password: string }) {
    const post = await Post.findByPk(postId);

    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    if (post.postPassword !== data.password) {
      return { status: 401, response: { message: "비밀번호가 틀렸습니다" } };
    }

    try {
      return {
        status: 200,
        response: { message: "비밀번호가 확인되었습니다" },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //게시글 공감하기
  async likePost(postId: number) {
    const post = await Post.findByPk(postId);

    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    try {
      // 공감(좋아요) 추가
      await PostLike.create({ postId });

      return {
        status: 200,
        response: { message: "게시글 공감하기 성공" },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }
}

export default new PostService();

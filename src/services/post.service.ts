import { Op, Sequelize } from "sequelize";
import Post from "../models/post.model";
import PostLike from "../models/postLike.model";
import Tag from "../models/tag.model";
import PostTag from "../models/postTag.model";
import Comment from "../models/comment.model";
import Group from "../models/group.model";
import GroupService from "./group.service";

class PostService {
  // 그룹 존재 여부 및 비밀번호 확인 로직을 추출한 함수
  private async validateGroup(groupId: number, groupPassword: string) {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return { status: 404, response: { message: "그룹이 존재하지 않습니다" } };
    }

    return { status: 200, response: { group } };
  }

  // 게시물 존재 여부 확인 및 비밀번호 검증 로직을 추출한 함수
  private async validatePost(postId: number, postPassword?: string) {
    const post = await Post.findByPk(postId);
    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }
    if (postPassword && post.postPassword !== postPassword) {
      return { status: 403, response: { message: "비밀번호가 틀렸습니다" } };
    }
    return { status: 200, response: { post } };
  }

  // 좋아요 수와 댓글 수를 조회하는 함수
  private async getPostDetails(postId: number) {
    const likeCount = await PostLike.count({ where: { postId } });
    const commentCount = await Comment.count({ where: { postId } });
    return { likeCount, commentCount };
  }

  //게시글 생성
  async createPost(data: {
    nickname: string;
    groupId: number;
    title: string;
    content: string;
    postPassword: string;
    imageUrl?: string;
    tags?: string[];
    location?: string;
    moment?: Date;
    isPublic: boolean;
  }) {

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
        const tags = await Tag.findAll({ where: { text: data.tags } });
        await PostTag.bulkCreate(
          tags.map((tag) => ({ postId: post.id, tagId: tag.id }))
        );
      }

      const { likeCount, commentCount } = await this.getPostDetails(post.id);

      const postWithTags = await Post.findByPk(post.id, {
        include: [{ model: Tag, as: "tags" }],
      });

      return {
        status: 201,
        response: {
          id: postWithTags?.id,
          groupId: postWithTags?.groupId,
          nickname: postWithTags?.nickname,
          title: postWithTags?.title,
          content: postWithTags?.content,
          imageUrl: postWithTags?.imageUrl,
          tags: postWithTags?.tags?.map((tag) => tag.text) || [],
          location: postWithTags?.location,
          moment: postWithTags?.moment,
          isPublic: postWithTags?.isPublic,
          likeCount,
          commentCount,
          createdAt: postWithTags?.createdAt,
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다." } };
    }
  }

  // 게시글 목록 조회
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
          include: [
            { model: Tag, as: "tags" },
            {
              model: PostLike,
              attributes: [],
            },
            {
              model: Comment,
              attributes: [],
            },
          ],
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
            "createdAt",
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM post_likes AS PostLike
                WHERE
                  PostLike.postId = Post.id
              )`),
              "likeCount",
            ],
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM comments AS Comment
                WHERE
                  Comment.postId = Post.id
              )`),
              "commentCount",
            ],
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
            tags: post.tags?.map((tag) => tag.text) || [],
            location: post.location,
            moment: post.moment,
            isPublic: post.isPublic,
            likeCount: post.getDataValue("likeCount"),
            commentCount: post.getDataValue("commentCount"),
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
    const postValidation = await this.validatePost(postId, data.postPassword);
    if (postValidation.status !== 200) return postValidation;

    const { post } = postValidation.response;
    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
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
        const tags = await Tag.findAll({ where: { text: data.tags } });
        await PostTag.bulkCreate(
          tags.map((tag) => ({ postId: post.id, tagId: tag.id })),
          { ignoreDuplicates: true }
        );
      }

      const { likeCount, commentCount } = await this.getPostDetails(post.id);

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
          tags: updatedPost?.tags?.map((tag) => tag.text) || [],
          location: updatedPost?.location,
          moment: updatedPost?.moment,
          isPublic: updatedPost?.isPublic,
          likeCount, // 좋아요 수 계산
          commentCount, // 댓글 수 계산
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
    const postValidation = await this.validatePost(postId, data.postPassword);
    if (postValidation.status !== 200) return postValidation;

    const { post } = postValidation.response;
    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
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
    const post = await Post.findByPk(postId, {
      include: [{ model: Tag, as: "tags" }],
    });

    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    try {
      const likeCount = await PostLike.count({ where: { postId: post.id } });
      const commentCount = await Comment.count({ where: { postId: post.id } });

      return {
        status: 200,
        response: {
          id: post.id,
          groupId: post.groupId,
          nickname: post.nickname,
          title: post.title,
          imageUrl: post.imageUrl,
          tags: post.tags?.map((tag) => tag.text) || [],
          location: post.location,
          moment: post.moment,
          isPublic: post.isPublic,
          likeCount,
          commentCount,
          createdAt: post.createdAt,
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //게시글 조회 권한 확인하기
  async verifyPostPassword(postId: number, data: { postPassword: string }) {
    const postValidation = await this.validatePost(postId, data.postPassword);
    if (postValidation.status !== 200) return postValidation;

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
      // 공감 추가
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

  //게시글 공개 여부 확인
  async checkPostIsPublic(postId: number) {
    const post = await Post.findByPk(postId, {
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
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }
}

export default new PostService();

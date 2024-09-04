import { Op } from "sequelize";
import Post from "../models/post.model";
import PostLike from "../models/postLike.model";
import Tag from "../models/tag.model";
import PostTag from "../models/postTag.model";
import Comment from "../models/comment.model";
import Group from "../models/group.model";
import BadgeService from "./badge.service";

interface GetPostsParams {
  page: number;
  pageSize: number;
  sortBy: "latest" | "mostCommented" | "mostLiked";
  keyword?: string;
  isPublic?: boolean;
  groupId?: number;
}

class PostService {

  private badgeService: BadgeService;

  constructor() {
    this.badgeService = new BadgeService();
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
        //기존 태그 찾기 또는 새로 생성
        const tags = await Promise.all(
          data.tags.map(async (text) => {
            const [tag] = await Tag.findOrCreate({ where: { text } });
            return tag;
          })
        );
        //PostTag 관계 생성
        await PostTag.bulkCreate(
          tags.map((tag) => ({ postId: post.id, tagId: tag.id }))
        );
      }

      const { likeCount, commentCount } = await this.getPostDetails(post.id);

      const postWithTags = await Post.findByPk(post.id, {
        include: [{ model: Tag, as: "tags" }],
      });

    //7일 연속 추억 등록 조건 검사 및 뱃지 부여
    const consecutivePostsMet = await this.badgeService.checkConsecutivePosts(data.groupId);
    if (consecutivePostsMet) {
      await this.badgeService.awardBadge(data.groupId, 1);
    }

    //추억 수 20개 이상 등록 조건 검사 및 뱃지 부여
    const minPostsMet = await this.badgeService.checkMinPosts(data.groupId);
    if (minPostsMet) {
      await this.badgeService.awardBadge(data.groupId, 2);

      //그룹의 뱃지 수 업데이트
      const group = await Group.findByPk(data.groupId);
      if (group) {
        await group.calculateBadgeCount();
      }
    }

      //그룹의 게시글 수 업데이트
      const group = await Group.findByPk(data.groupId);
      if (group) {
        await group.calculatePostCount();
      }

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

  //게시글 목록 조회
  async getPosts(params: GetPostsParams) {
    const { page, pageSize, sortBy, keyword, isPublic, groupId } = params;
    const offset = (page - 1) * pageSize;

    //정렬 기준 설정
    let order: Array<[string, 'ASC' | 'DESC']> = [];
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
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { tags: { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {};

    //쿼리 생성
    const query = {
      where: {
        ...searchCondition,
        isPublic,
        groupId,
      },
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
      include: [{ model: Tag, as: 'tags', attributes: ['text'] }],
    };

    //총 게시글 수 조회
    const totalItemCount = await Post.count({
      where: {
        ...searchCondition,
        isPublic,
        groupId,
      },
    });

    //게시글 목록 조회
    const posts = await Post.findAll(query);

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
        tags: post.tags ? post.tags.map(tag => tag.text) : [],  // `tags`가 undefined일 경우 빈 배열로 처리
        location: post.location,
        moment: post.moment,
        isPublic: post.isPublic,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
      })),
    };
  }


  //게시글 수정
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
        const tags = await Promise.all(
          data.tags.map(async (text) => {
            const [tag] = await Tag.findOrCreate({ where: { text } });
            return tag;
          })
        );
  
        //기존 태그 관계 제거 후 새로운 태그 관계 생성
        await PostTag.destroy({ where: { postId: post.id } });
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
          likeCount,
          commentCount,
          createdAt: updatedPost?.createdAt,
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 400, response: { message: "잘못된 요청입니다" } };
    }
  }

  //게시글 삭제
  async deletePost(postId: number, data: { postPassword: string }) {
    const postValidation = await this.validatePost(postId, data.postPassword);
    if (postValidation.status !== 200) return postValidation;

    const { post } = postValidation.response;
    if (!post) {
      return { status: 404, response: { message: "존재하지 않습니다" } };
    }

    try {

      //삭제될 게시글과 관련된 태그 가져오기
      const postTags = await PostTag.findAll({ where: { postId } });
      const tagIds = postTags.map((postTag) => postTag.tagId);
      await post.destroy();

      //각 태그가 다른 게시글에서도 사용되는지 확인 후, 사용되지 않는 태그 삭제
      for (const tagId of tagIds) {
        const postTagCount = await PostTag.count({ where: { tagId } });
        if (postTagCount === 0) {
         await Tag.destroy({ where: { id: tagId } });
      }
    }

      //그룹의 게시글 수 업데이트
      const group = await Group.findByPk(post.groupId);
      if (group) {
        await group.calculatePostCount();
      }

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

  // 게시글에 공감하기
  async likePost(postId: number): Promise<Post> {

    const post = await Post.findByPk(postId);
    if (!post) throw new Error("게시글을 찾을 수 없습니다.");
  
    // 공감 수 증가
    post.likeCount += 1;
    await post.save();
  
    const badgeId = 5;

    // 공감 개수 조건을 검사
    const minPostLikesMet = await this.badgeService.checkMinPostLikes(postId);

    // 조건이 만족되면 뱃지를 부여
    if (minPostLikesMet && post.groupId) {
      await this.badgeService.awardBadge(post.groupId, badgeId);
      
      // 그룹의 뱃지 수 업데이트
      const group = await Group.findByPk(post.groupId);
      if (group) {
        await group.calculateBadgeCount();
      }
    }
    return post;
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
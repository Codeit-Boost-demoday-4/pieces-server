import Post from "../models/post.model";
import Tag from "../models/tag.model";

class PostService {
  async createPost(data: {
    userId: number;
    groupId: number;
    title: string;
    content: string;
    postPassword: string;
    imageUrl?: string;
    tags?: string[]; // 태그 추가
    location?: string;
    moment?: Date;
    isPublic: boolean;
  }) {
    const post = await Post.create(data);

    // 만약 태그 데이터가 포함되어 있다면, 태그를 연결
    if (data.tags && data.tags.length > 0) {
      const tags = await Tag.findAll({
        where: {
          text: data.tags,
        },
      });
      await post.setTags(tags);
    }

    // 생성된 포스트의 데이터를 가공하여 반환
    const postWithTags = await Post.findByPk(post.id, {
      include: [{ model: Tag, as: "tags" }],
    });

    // 생성된 포스트의 데이터를 가공하여 반환
    const response = {
      id: postWithTags?.id,
      groupId: postWithTags?.groupId,
      nickname: "string",
      title: postWithTags?.title,
      content: postWithTags?.content,
      imageUrl: postWithTags?.imageUrl,
      tags: postWithTags?.tags?.map((tag) => tag.text) || [],
      location: postWithTags?.location,
      moment: postWithTags?.moment,
      isPublic: postWithTags?.isPublic,
      likeCount: 0,
      commentCount: 0,
      createdAt: postWithTags?.createdAt,
    };

    return response;
  }

  async getPost() {
    const publicPosts = await Post.findAll({
      where: { isPublic: true },
      attributes: [
        "id",
        "groupId",
        "nickname",
        "title",
        "content",
        "imageUrl",
        "tags",
        "location",
        "moment",
        "isPublic",
        "likeCount",
        "commentCount",
        "createdAt",
      ],
    });

    const privatePosts = await Post.findAll({
      where: { isPublic: true },
      attributes: [
        "id",
        "groupId",
        "nickname",
        "title",
        "content",
        "imageUrl",
        "tags",
        "location",
        "moment",
        "isPublic",
        "likeCount",
        "commentCount",
        "createdAt",
      ],
    });

    return { publicPosts, privatePosts };
  }
}

export default new PostService();

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// 모델의 속성 인터페이스 정의
interface PostAttributes {
  id: number;
  nickname: number;
  groupId: number;
  title: string;
  postPassword: string;
  imageUrl?: string;
  tags?: string[];
  content: string;
  location?: string;
  moment?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// 일부 필드만 필수로 지정할 수 있도록 인터페이스 확장
interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    | "id"
    | "imageUrl"
    | "tags"
    | "location"
    | "moment"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

// Sequelize 모델 정의
class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public nickname!: number;
  public groupId!: number;
  public title!: string;
  public postPassword!: string;
  public imageUrl?: string;
  public tags?: string[];
  public content!: string;
  public location?: string;
  public moment?: Date;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nickname: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        groupId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        postPassword: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        moment: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "posts",
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        timestamps: true,
        underscored: true, // 필드 이름을 snake_case로 자동 변환
      }
    );
  }

  // 관계 설정
  static associate(models: any) {
    Post.belongsTo(models.User, { foreignKey: "nickname", as: "user" });
    Post.belongsTo(models.Group, { foreignKey: "groupId", as: "group" });
    Post.hasMany(models.Comment, { foreignKey: "postId", as: "comments" });
    Post.belongsToMany(models.Tag, {
      through: models.PostTag,
      foreignKey: "postId",
      as: "tags",
    });
    Post.belongsToMany(models.User, {
      through: models.PostLike,
      foreignKey: "postId",
      as: "likedBy",
    });
  }
}

export default Post;

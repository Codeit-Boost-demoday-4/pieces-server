import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Tag from "./tag.model";
interface PostAttributes {
  id: number;
  nickname: string;
  groupId: number;
  title: string;
  postPassword: string;
  imageUrl?: string;
  content: string;
  location?: string;
  moment?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  tags?: Tag[];
  likeCount?: number;
  commentCount?: number;
}

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    | "id"
    | "imageUrl"
    | "location"
    | "moment"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "tags"
  > {}

//Sequelize 모델 정의
class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{

  public id!: number;
  public nickname!: string;
  public groupId!: number;
  public title!: string;
  public postPassword!: string;
  public imageUrl?: string;
  public content!: string;
  public location?: string;
  public moment?: Date;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  public tags?: Tag[];
  public likeCount!: number;
  public commentCount!: number;

  static initModel(sequelize: Sequelize) {
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nickname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        groupId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "groups",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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
        likeCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        commentCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "posts",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    Post.belongsTo(models.Group, { foreignKey: "groupId", as: "group" });
    Post.hasMany(models.Comment, { foreignKey: "postId", as: "comments" });
    Post.belongsToMany(models.Tag, { through: models.PostTag, as: 'tags', foreignKey: 'postId' });
    Post.hasMany(models.PostLike, { foreignKey: 'postId' });
  }

}


export default Post;
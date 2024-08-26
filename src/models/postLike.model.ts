import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface PostLikeAttributes {
  userId: number;
  postId: number;
  createdAt: Date;
}

interface PostLikeCreationAttributes
  extends Optional<PostLikeAttributes, "createdAt"> {}

class PostLike
  extends Model<PostLikeAttributes, PostLikeCreationAttributes>
  implements PostLikeAttributes
{
  public userId!: number;
  public postId!: number;
  public readonly createdAt!: Date;

  static initModel(sequelize: Sequelize) {
    PostLike.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "users", key: "id" },
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "posts", key: "id" },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "PostLike",
        tableName: "post_likes",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        underscored: true,
      }
    );
  }
}

export default PostLike;

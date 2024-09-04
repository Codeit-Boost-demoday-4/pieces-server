import { DataTypes, Model, Optional, Sequelize } from "sequelize";
interface PostLikeAttributes {
  postId: number;
  createdAt: Date;
}

interface PostLikeCreationAttributes
  extends Optional<PostLikeAttributes, "createdAt"> {}

class PostLike
  extends Model<PostLikeAttributes, PostLikeCreationAttributes>
  implements PostLikeAttributes
{
  public postId!: number;
  public readonly createdAt!: Date;

  static initModel(sequelize: Sequelize) {
    PostLike.init(
      {
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "posts", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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

  static associate(models: any) {
    PostLike.belongsTo(models.Post, { foreignKey: 'postId' });
  }
}
export default PostLike;

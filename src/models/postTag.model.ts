import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface PostTagAttributes {
  postId: number;
  tagId: number;
  createdAt: Date;
}

interface PostTagCreationAttributes
  extends Optional<PostTagAttributes, "createdAt"> {}

class PostTag
  extends Model<PostTagAttributes, PostTagCreationAttributes>
  implements PostTagAttributes
{
  public postId!: number;
  public tagId!: number;
  public readonly createdAt!: Date;

  static initModel(sequelize: Sequelize) {
    PostTag.init(
      {
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "posts", key: "id" },
          primaryKey: true, // 복합 키의 일부로 설정

        },
        tagId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "tags", key: "id" },
          primaryKey: true, // 복합 키의 일부로 설정

        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "PostTag",
        tableName: "post_tags",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        underscored: true,
      }
    );
  }
}

export default PostTag;

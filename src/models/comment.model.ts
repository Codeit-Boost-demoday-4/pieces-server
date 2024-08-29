import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface CommentAttributes {
  id: number;
  nickname: string;
  postId: number;
  content: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface CommentCreationAttributes
  extends Optional<
    CommentAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public nickname!: string;
  public postId!: number;
  public content!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Comment.init(
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
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
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
        modelName: "Comment",
        tableName: "comments",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default Comment;

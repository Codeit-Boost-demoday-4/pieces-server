import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Post from './post.model';
import GroupBadge from './groupBadge.model';
import BadgeService from "../services/badge.service";

interface GroupAttributes {
  id: number;
  name: string;
  imageUrl: string;
  introduction: string;
  isPublic: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  likeCount?: number;
  badgeCount?: number;
  postCount?: number;
}

// 일부 필드만 필수로 지정할 수 있도록 인터페이스 확장
interface GroupCreationAttributes
  extends Optional<GroupAttributes, "createdAt" | "updatedAt"> {}

// Sequelize 모델 정의
class Group
  extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes
{
  public id!: number;
  public name!: string;
  public imageUrl!: string;
  public introduction!: string;
  public isPublic!: boolean;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  public likeCount!: number;
  public badgeCount!: number;
  public postCount!: number;

static initModel(sequelize: Sequelize) {
    Group.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        introduction: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        passwordHash: {
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
        likeCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        badgeCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        postCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "Group",
        tableName: "groups",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
        underscored: true,
      }
    );
  }

    static associate(models: any) {
      Group.hasMany(models.Post, { foreignKey: "groupId", as: "posts" });
      Group.hasMany(models.GroupBadge, { foreignKey: "groupId", as: "groupBadges" });
    }



  //badgeCount를 계산하는 메서드
  public async calculateBadgeCount(): Promise<number> {
    const badgeCount = await GroupBadge.count({
      where: { groupId: this.id },
    });
    this.badgeCount = badgeCount;
    await this.save();
    return badgeCount;
  }

  //postCount를 계산하는 메서드
  public async calculatePostCount(): Promise<number> {
    const postCount = await Post.count({
      where: { groupId: this.id },
    });
    this.postCount = postCount;
    await this.save();
    return postCount;
  }
}

export default Group;

import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import Group from './group.model'; // Group 모델 import

interface GroupBadgeAttributes {
    groupId: number;
    badgeId: number;
    readonly createdAt?: Date;
  }

  interface GroupBadgeCreationAttributes extends Optional<GroupBadgeAttributes, 'createdAt'> {}

  class GroupBadge extends Model<GroupBadgeAttributes, GroupBadgeCreationAttributes> implements GroupBadgeAttributes {
    public groupId!: number;
    public badgeId!: number;
    public readonly createdAt!: Date;


// 모델 초기화 함수
static initModel(sequelize: Sequelize) {
  GroupBadge.init(
    {
    groupId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,

    },
    badgeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    tableName: 'group_badges',
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    underscored: true,
    }
  );
 }
}
export default GroupBadge;

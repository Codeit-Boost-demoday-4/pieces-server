import { DataTypes, Model, Sequelize } from 'sequelize';
import Group from './group.model';
import Badge from './badge.model';

interface GroupBadgeAttributes {
  groupId: number;
  badgeId: number;
}

class GroupBadge extends Model<GroupBadgeAttributes> implements GroupBadgeAttributes {
  public groupId!: number;
  public badgeId!: number;

  static initModel(sequelize: Sequelize) {
    GroupBadge.init(
      {
        groupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: Group,
            key: 'id',
          },
        },
        badgeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: Badge,
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'group_badges',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false, // 타임스탬프 필드 사용 안 함
        underscored: true,
      }
    );
  }
}

export default GroupBadge;

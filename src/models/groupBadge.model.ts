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
    badge: any;

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
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        badgeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: Badge,
            key: 'id',
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: 'group_badges',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    GroupBadge.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    GroupBadge.belongsTo(models.Badge, { foreignKey: 'badgeId', as: 'badge' });
  }
}

export default GroupBadge;

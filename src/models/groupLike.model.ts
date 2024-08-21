import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface GroupLikeAttributes {
    groupId: number;
    userId: number;
    readonly createdAt?: Date;
  }

  interface GroupLikeCreationAttributes extends Optional<GroupLikeAttributes, 'createdAt'> {}

  class GroupLike extends Model<GroupLikeAttributes, GroupLikeCreationAttributes> implements GroupLikeAttributes {
    public groupId!: number;
    public userId!: number;
    public readonly createdAt!: Date;


// 모델 초기화 함수
static initModel(sequelize: Sequelize) {
    GroupLike.init(
    {
      groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
  }, {
    sequelize,
    tableName: 'group_likes',
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    underscored: true,
    }
  );
 }
}
export default GroupLike;

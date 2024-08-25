import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface BadgeAttributes {
  id: number;
  name: string;
}

interface BadgeCreationAttributes extends Optional<BadgeAttributes, 'id'> {}

class Badge extends Model<BadgeAttributes, BadgeCreationAttributes> implements BadgeAttributes {
  public id!: number;
  public name!: string;

  static initModel(sequelize: Sequelize) {
    Badge.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'badges',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false, // 타임스탬프 필드 사용 안 함
        underscored: true,
      }
    );
  }
}

export default Badge;

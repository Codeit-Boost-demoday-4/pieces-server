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

  // 관계 설정
  static associate(models: any) {
    Badge.hasMany(models.GroupBadge, { foreignKey: 'badgeId', as: 'groupBadges' });
  }

    // 시드 데이터 추가
  static async seedBadges() {
    const badges = [
      { id: 1, name: '7일 연속 추억 등록' },
      { id: 2, name: '추억 수 20개 이상 등록' },
      { id: 3, name: '그룹 생성 후 1년 달성' },
      { id: 4, name: '그룹 공감 1만 개 이상 받기' },
      { id: 5, name: '추억 공감 1만 개 이상 받기' },
    ];

    for (const badge of badges) {
      await Badge.findOrCreate({
        where: { id: badge.id },
        defaults: badge,
      });
    }
  }
  
}

export default Badge;
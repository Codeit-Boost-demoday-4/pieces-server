import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// 모델의 속성 인터페이스 정의
interface GroupAttributes {
  name: string;
  imageUrl: string;
  introduction: string;
  isPublic: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date; //선택적 필드
  deletedAt?: Date; //선택적 필드
  /*
  likeCount?: number;
  badgeCount?: number;
  postCount?: number;
  */
}

/*
timestamps 옵션을 true로 설정하면, createdAt과 updatedAt 필드가 자동으로 관리됩니다. 
이 경우 모델 인스턴스를 생성할 때 createdAt 필드를 명시적으로 지정할 필요가 없습니다.
그래도 일단 넣어봤어요
*/

// 일부 필드만 필수로 지정할 수 있도록 인터페이스 확장
interface GroupCreationAttributes extends Optional<GroupAttributes, 'createdAt' | 'updatedAt'> {}

// Sequelize 모델 정의
class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
  public name!: string; // 속성뒤 !는 not null을 의미
  public imageUrl!: string;
  public introduction!: string;
  public isPublic!: boolean;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  /*
  public likeCount!: number;
  public badgeCount!: number;
  public postCount!: number;
  */


static initModel(sequelize: Sequelize) {
    Group.init(
      {
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
/*
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
*/
      },
      {
        sequelize,
        modelName: 'Group',
        tableName: 'groups',
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
        timestamps: true,
        underscored: true, // **필드 이름을 snake_case로 자동 변환**
      }
    );
  }
}

export default Group;
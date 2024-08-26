import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // 테이블 생성
    await queryInterface.createTable("posts", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        onDelete: "CASCADE", // 사용자 삭제 시 게시물도 함께 삭제
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          // 외래 키 설정
          model: "groups",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postPassword: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true, // content는 optional
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      moment: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    });
  },

  async down(queryInterface: QueryInterface) {
    // 테이블 삭제 (롤백)
    await queryInterface.dropTable("posts");
  },
};

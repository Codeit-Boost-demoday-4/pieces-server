"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 테이블 생성
    await queryInterface.createTable("posts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          // 외래 키 설정
          model: "users", // 참조하는 테이블 이름
          key: "id", // 참조하는 칼럼 이름
        },
        onDelete: "CASCADE", // 사용자 삭제 시 게시물도 함께 삭제
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          // 외래 키 설정
          model: "groups",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postPassword: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true, // content는 optional
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      moment: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // 테이블 삭제 (롤백)
    await queryInterface.dropTable("posts");
  },
};

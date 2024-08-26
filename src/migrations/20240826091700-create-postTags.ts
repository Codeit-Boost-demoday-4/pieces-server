import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // post_tags 테이블 생성
    await queryInterface.createTable("post_tags", {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "posts", // posts 테이블과 연결
          key: "id",
        },
        onDelete: "CASCADE", // 연결된 post가 삭제되면 해당 태그도 삭제
        onUpdate: "CASCADE",
        primaryKey: true, // 복합 기본 키의 일부로 설정
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tags", // tags 테이블과 연결
          key: "id",
        },
        onDelete: "CASCADE", // 연결된 tag가 삭제되면 해당 관계도 삭제
        onUpdate: "CASCADE",
        primaryKey: true, // 복합 기본 키의 일부로 설정
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    // post_tags 테이블 삭제
    await queryInterface.dropTable("post_tags");
  },
};

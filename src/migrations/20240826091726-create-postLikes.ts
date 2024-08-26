import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // post_likes 테이블 생성
    await queryInterface.createTable("post_likes", {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "posts", // posts 테이블과 연결
          key: "id",
        },
        onDelete: "CASCADE", // 연결된 post가 삭제되면 해당 like도 삭제
        onUpdate: "CASCADE",
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    // post_likes 테이블 삭제
    await queryInterface.dropTable("post_likes");
  },
};

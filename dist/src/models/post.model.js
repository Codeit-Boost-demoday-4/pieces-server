"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Sequelize 모델 정의
class Post extends sequelize_1.Model {
    static initModel(sequelize) {
        Post.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nickname: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            groupId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            postPassword: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            imageUrl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            tags: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            moment: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            isPublic: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            deletedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "Post",
            tableName: "posts",
            charset: "utf8",
            collate: "utf8_general_ci", // 한글 저장
            timestamps: true,
            underscored: true, // 필드 이름을 snake_case로 자동 변환
        });
    }
    // 관계 설정
    static associate(models) {
        Post.belongsTo(models.User, { foreignKey: "nickname", as: "user" });
        Post.belongsTo(models.Group, { foreignKey: "groupId", as: "group" });
        Post.hasMany(models.Comment, { foreignKey: "postId", as: "comments" });
        Post.belongsToMany(models.Tag, {
            through: models.PostTag,
            foreignKey: "postId",
            as: "tags",
        });
        Post.belongsToMany(models.User, {
            through: models.PostLike,
            foreignKey: "postId",
            as: "likedBy",
        });
    }
}
exports.default = Post;

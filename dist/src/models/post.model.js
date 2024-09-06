"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//Sequelize 모델 정의
class Post extends sequelize_1.Model {
    static initModel(sequelize) {
        Post.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nickname: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            groupId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "groups",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
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
            likeCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            commentCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            modelName: "Post",
            tableName: "posts",
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: true,
            underscored: true,
        });
    }
    static associate(models) {
        Post.belongsTo(models.Group, { foreignKey: "groupId", as: "group" });
        Post.hasMany(models.Comment, { foreignKey: "postId", as: "comments" });
        Post.belongsToMany(models.Tag, { through: models.PostTag, as: 'tags', foreignKey: 'postId' });
        Post.hasMany(models.PostLike, { foreignKey: 'postId' });
    }
}
exports.default = Post;

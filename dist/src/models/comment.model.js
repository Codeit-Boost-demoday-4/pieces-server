"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Comment extends sequelize_1.Model {
    static initModel(sequelize) {
        Comment.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nickname: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            postId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "posts",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
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
            modelName: "Comment",
            tableName: "comments",
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: true,
            underscored: true,
        });
    }
    static associate(models) {
        Comment.belongsTo(models.Post, { as: 'post', foreignKey: 'postId' });
    }
}
exports.default = Comment;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class PostTag extends sequelize_1.Model {
    static initModel(sequelize) {
        PostTag.init({
            postId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: "posts", key: "id" },
                primaryKey: true, //복합 키의 일부
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            tagId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: "tags", key: "id" },
                primaryKey: true, // 복합 키의 일부
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: "PostTag",
            tableName: "post_tags",
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: false,
            underscored: true,
        });
    }
}
exports.default = PostTag;

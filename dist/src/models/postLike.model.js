"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class PostLike extends sequelize_1.Model {
    static initModel(sequelize) {
        PostLike.init({
            postId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: "posts", key: "id" },
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: "PostLike",
            tableName: "post_likes",
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: false,
            underscored: true,
        });
    }
}
exports.default = PostLike;

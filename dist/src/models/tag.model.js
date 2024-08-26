"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Tag extends sequelize_1.Model {
    static initModel(sequelize) {
        Tag.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            text: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            modelName: "Tag",
            tableName: "tags",
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: false,
            underscored: true,
        });
    }
    // 관계 설정
    static associate(models) {
        Tag.belongsToMany(models.Post, {
            through: models.PostTag,
            foreignKey: "tagId",
            as: "posts",
        });
    }
}
exports.default = Tag;

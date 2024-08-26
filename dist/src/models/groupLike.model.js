"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class GroupLike extends sequelize_1.Model {
    // 모델 초기화 함수
    static initModel(sequelize) {
        GroupLike.init({
            groupId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            tableName: 'group_likes',
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            underscored: true,
        });
    }
}
exports.default = GroupLike;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = initModel;
const sequelize_1 = require("sequelize");
// GroupLike 모델 정의
class GroupLike extends sequelize_1.Model {
}
function initModel(sequelize) {
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
    });
}
exports.default = GroupLike;

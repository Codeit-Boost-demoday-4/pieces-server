"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = initModel;
const sequelize_1 = require("sequelize");
// GroupBadge 모델 정의
class GroupBadge extends sequelize_1.Model {
}
function initModel(sequelize) {
    GroupBadge.init({
        groupId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        badgeId: {
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
        tableName: 'group_badges',
        timestamps: true,
        modelName: 'GroupBadge',
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
        underscored: true,
    });
}
exports.default = GroupBadge;

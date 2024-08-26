"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class GroupBadge extends sequelize_1.Model {
    // 모델 초기화 함수
    static initModel(sequelize) {
        GroupBadge.init({
            groupId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            badgeId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
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
            charset: 'utf8',
            collate: 'utf8_general_ci',
            underscored: true,
        });
    }
}
exports.default = GroupBadge;

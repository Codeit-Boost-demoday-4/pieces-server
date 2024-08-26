"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Sequelize 모델 정의
class Group extends sequelize_1.Model {
    static initModel(sequelize) {
        Group.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED, // 부호 없는 정수
                autoIncrement: true, // 자동 증가
                primaryKey: true, // 기본 키
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            imageUrl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            introduction: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            isPublic: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
            },
            passwordHash: {
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
            likeCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            badgeCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            postCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            tableName: 'groups',
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글 저장
            timestamps: true,
            underscored: true, // **필드 이름을 snake_case로 자동 변환**
        });
    }
}
exports.default = Group;

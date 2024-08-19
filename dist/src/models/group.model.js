"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Sequelize 모델 정의
class Group extends sequelize_1.Model {
    /*
    public likeCount!: number;
    public badgeCount!: number;
    public postCount!: number;
    */
    static initModel(sequelize) {
        Group.init({
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
            /*
                    likeCount: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0,
                      },
                    badgeCount: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0,
                      },
                    postCount: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0,
                      },
            */
        }, {
            sequelize,
            modelName: 'Group',
            tableName: 'groups',
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글 저장
            timestamps: true,
            underscored: true, // **필드 이름을 snake_case로 자동 변환**
        });
    }
}
exports.default = Group;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            // 테이블 생성
            yield queryInterface.createTable("posts", {
                id: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                nickname: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    onDelete: "CASCADE", // 사용자 삭제 시 게시물도 함께 삭제
                },
                groupId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        // 외래 키 설정
                        model: "groups",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                title: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                },
                postPassword: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                },
                imageUrl: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                },
                content: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true, // content는 optional
                },
                location: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                },
                moment: {
                    type: sequelize_1.DataTypes.DATE,
                    allowNull: true,
                },
                isPublic: {
                    type: sequelize_1.DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
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
            });
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            // 테이블 삭제 (롤백)
            yield queryInterface.dropTable("posts");
        });
    },
};

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
            // post_likes 테이블 생성
            yield queryInterface.createTable("post_likes", {
                postId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "posts", // posts 테이블과 연결
                        key: "id",
                    },
                    onDelete: "CASCADE", // 연결된 post가 삭제되면 해당 like도 삭제
                    onUpdate: "CASCADE",
                    primaryKey: true,
                },
                createdAt: {
                    type: sequelize_1.DataTypes.DATE,
                    allowNull: false,
                    defaultValue: sequelize_1.DataTypes.NOW,
                },
            });
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            // post_likes 테이블 삭제
            yield queryInterface.dropTable("post_likes");
        });
    },
};

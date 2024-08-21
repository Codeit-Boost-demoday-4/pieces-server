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
module.exports = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.createTable('groups', {
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            image_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            introduction: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_public: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
            },
            password_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
            updated_at: {
                allowNull: true,
                type: sequelize_1.DataTypes.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: sequelize_1.DataTypes.DATE,
            },
        });
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable('groups');
    }),
};

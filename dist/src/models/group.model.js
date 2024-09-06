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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const post_model_1 = __importDefault(require("./post.model"));
const groupBadge_model_1 = __importDefault(require("./groupBadge.model"));
// Sequelize 모델 정의
class Group extends sequelize_1.Model {
    static initModel(sequelize) {
        Group.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
            modelName: "Group",
            tableName: "groups",
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: true,
            underscored: true,
        });
    }
    static associate(models) {
        Group.hasMany(models.Post, { foreignKey: "groupId", as: "posts" });
        Group.hasMany(models.GroupBadge, { foreignKey: "groupId", as: "groupBadges" });
    }
    //badgeCount를 계산하는 메서드
    calculateBadgeCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const badgeCount = yield groupBadge_model_1.default.count({
                where: { groupId: this.id },
            });
            this.badgeCount = badgeCount;
            yield this.save();
            return badgeCount;
        });
    }
    //postCount를 계산하는 메서드
    calculatePostCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const postCount = yield post_model_1.default.count({
                where: { groupId: this.id },
            });
            this.postCount = postCount;
            yield this.save();
            return postCount;
        });
    }
}
exports.default = Group;

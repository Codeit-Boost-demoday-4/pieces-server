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
class Badge extends sequelize_1.Model {
    static initModel(sequelize) {
        Badge.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'badges',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false,
            underscored: true,
        });
    }
    // 관계 설정
    static associate(models) {
        Badge.hasMany(models.GroupBadge, { foreignKey: 'badgeId', as: 'groupBadges' });
    }
    // 시드 데이터 추가
    static seedBadges() {
        return __awaiter(this, void 0, void 0, function* () {
            const badges = [
                { id: 1, name: '👾7일 연속 추억 등록' },
                { id: 2, name: '❤️‍🔥추억 수 20개 이상 등록' },
                { id: 3, name: '🎉그룹 생성 후 1년 달성' },
                { id: 4, name: '🌼그룹 공감 1만 개 이상 받기' },
                { id: 5, name: '💖추억 공감 1만 개 이상 받기' },
            ];
            for (const badge of badges) {
                yield Badge.findOrCreate({
                    where: { id: badge.id },
                    defaults: badge,
                });
            }
        });
    }
}
exports.default = Badge;

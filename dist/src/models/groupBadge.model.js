"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const group_model_1 = __importDefault(require("./group.model"));
const badge_model_1 = __importDefault(require("./badge.model"));
class GroupBadge extends sequelize_1.Model {
    static initModel(sequelize) {
        GroupBadge.init({
            groupId: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: group_model_1.default,
                    key: 'id',
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            badgeId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                references: {
                    model: badge_model_1.default,
                    key: 'id',
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
        }, {
            sequelize,
            tableName: 'group_badges',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false,
            underscored: true,
        });
    }
    static associate(models) {
        GroupBadge.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
        GroupBadge.belongsTo(models.Badge, { foreignKey: 'badgeId', as: 'badge' });
    }
}
exports.default = GroupBadge;

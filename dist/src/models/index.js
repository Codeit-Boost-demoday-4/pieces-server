"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config/config"));
const db = {};
const sequelize = new sequelize_1.Sequelize(config_1.default.development.database, config_1.default.development.username, config_1.default.development.password, {
    host: config_1.default.development.host,
    dialect: "mysql",
});
exports.sequelize = sequelize;
// models 폴더의 모든 모델을 동적으로 가져옵니다.
const models = {};
exports.models = models;
const modelFiles = fs_1.default.readdirSync(path_1.default.join(__dirname))
    .filter(file => file.endsWith('.ts') && file !== 'index.ts');
for (const file of modelFiles) {
    const model = require(path_1.default.join(__dirname, file)).default;
    // 모델을 초기화 (init)하고 sequelize에 등록
    if (model.initModel) {
        model.initModel(sequelize);
    }
    models[model.name] = model;
}
// 모델 간의 관계 설정 (associate 호출)
for (const modelName in models) {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
}
exports.default = sequelize;

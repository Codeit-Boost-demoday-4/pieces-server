"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.models = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
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
const loadModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // models 디렉토리에서 모든 파일을 읽어옵니다.
        const modelFiles = (yield promises_1.default.readdir(path_1.default.join(__dirname)))
            .filter(file => (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.js' && file !== 'index.ts');
        // 각 파일에 대해 모델을 로드하고 초기화합니다.
        for (const file of modelFiles) {
            try {
                const model = (yield Promise.resolve(`${path_1.default.join(__dirname, file)}`).then(s => __importStar(require(s)))).default;
                if (model.initModel) {
                    model.initModel(sequelize);
                }
                models[model.name] = model;
            }
            catch (error) {
                console.error(`Failed to load model from file ${file}:`, error);
            }
        }
        // 모델 간의 관계를 설정합니다.
        for (const modelName in models) {
            if (models[modelName].associate) {
                models[modelName].associate(models);
            }
        }
    }
    catch (error) {
        console.error('Failed to load models:', error);
    }
});
// 모델을 로드합니다.
loadModels().catch(error => {
    console.error('Error during model loading:', error);
});
exports.default = sequelize;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Group API',
            version: '1.0.0',
            description: 'API 문서입니다.',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000', // API 서버 URL
        },
    ],
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // API 문서화할 경로
};
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpecification));
};
exports.setupSwagger = setupSwagger;
const openapiSpecification = (0, swagger_jsdoc_1.default)(options);

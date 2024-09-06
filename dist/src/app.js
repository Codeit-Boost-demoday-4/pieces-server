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
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models"));
const dotenv_1 = __importDefault(require("dotenv"));
const group_router_1 = __importDefault(require("./routes/group.router"));
const badge_router_1 = __importDefault(require("./routes/badge.router"));
const post_router_1 = __importDefault(require("./routes/post.router"));
const comment_router_1 = __importDefault(require("./routes/comment.router"));
const swagger_1 = require("../swagger"); // Swagger 설정 임포트
const badge_model_1 = __importDefault(require("./models/badge.model"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); // .env 파일의 환경 변수를 불러옵니다
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DBNAME:', process.env.DB_DBNAME);
console.log('DB_HOST:', process.env.DB_HOST);
const app = (0, express_1.default)();
app.use(express_1.default.json());
// CORS 설정
app.use((0, cors_1.default)({
    origin: [
        'http://pieces.react.codeit.s3-website.ap-northeast-2.amazonaws.com',
        'http://localhost:3000',
        'http://localhost:3001',
    ], // 프론트엔드의 도메인
    methods: 'GET,POST,PUT,DELETE', // 허용할 HTTP 메서드
}));
// Swagger 설정 추가
(0, swagger_1.setupSwagger)(app);
app.use('/api/groups', group_router_1.default);
app.use('/api/badges', badge_router_1.default);
app.use('/api', post_router_1.default, comment_router_1.default);
const PORT = process.env.PORT || 3000; //웹서버 포트
models_1.default.authenticate()
    .then(() => {
    console.log('연결에 성공했습니다.');
    // 모든 모델을 동기화
    return models_1.default.sync({ /*alter: true*/}); // alter: true는 기존 테이블을 변경할 수 있도록 설정    
})
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield badge_model_1.default.seedBadges(); // 시드 데이터 추가
    console.log('모든 모델 동기화에 성공했습니다.');
}))
    .catch((error) => {
    console.error('데이터베이스에 연결할 수 없습니다.:', error);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // .env 파일의 환경 변수를 불러옵니다
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DBNAME:', process.env.DB_DBNAME);
console.log('DB_HOST:', process.env.DB_HOST);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; //웹서버 포트
models_1.default.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
    // 모든 모델을 동기화
    return models_1.default.sync({ force: true }); // alter: true는 기존 테이블을 변경할 수 있도록 설정    
})
    .then(() => {
    console.log('All models were synchronized successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;

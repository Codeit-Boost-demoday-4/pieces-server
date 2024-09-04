import express from 'express';
import sequelize from './models';
import dotenv from "dotenv";
import groupRouter from './routes/group.router';
import badgeRouter from './routes/badge.router';
import postRouter from './routes/post.router';
import commentRouter from './routes/comment.router';
import { setupSwagger } from '../swagger'; // Swagger 설정 임포트
import Badge from './models/badge.model';
import cors from 'cors';


dotenv.config(); // .env 파일의 환경 변수를 불러옵니다

console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DBNAME:', process.env.DB_DBNAME);
console.log('DB_HOST:', process.env.DB_HOST);

const app = express();

app.use(express.json());

// CORS 설정
app.use(cors({
  origin: [
    'http://pieces.react.codeit.s3-website.ap-northeast-2.amazonaws.com',
    'http://localhost:3000',
  ],// 프론트엔드의 도메인
    
  methods: 'GET,POST,PUT,DELETE', // 허용할 HTTP 메서드
}));

// Swagger 설정 추가
setupSwagger(app);

app.use('/api/groups', groupRouter);  
app.use('/api/badges', badgeRouter);
app.use('/api', postRouter, commentRouter);

const PORT = process.env.PORT || 3000; //웹서버 포트

sequelize.authenticate()
  .then(() => {
    console.log('연결에 성공했습니다.');

    // 모든 모델을 동기화
    return sequelize.sync({ /*alter: true*/ }); // alter: true는 기존 테이블을 변경할 수 있도록 설정    
  })
  .then(async() => {

    await Badge.seedBadges(); // 시드 데이터 추가

    console.log('모든 모델 동기화에 성공했습니다.');
          
  })

  .catch((error) => {
    console.error('데이터베이스에 연결할 수 없습니다.:', error);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
export default app;
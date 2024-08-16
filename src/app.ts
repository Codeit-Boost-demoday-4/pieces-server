import express from 'express';
import sequelize from './models';
import dotenv from "dotenv";
import groupRouter from './routes/group.router';
import { setupSwagger } from '../swagger'; // Swagger 설정 임포트

dotenv.config(); // .env 파일의 환경 변수를 불러옵니다

console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DBNAME:', process.env.DB_DBNAME);
console.log('DB_HOST:', process.env.DB_HOST);

const app = express();

app.use(express.json());

// Swagger 설정 추가
setupSwagger(app);

// '/api' prefix로 라우터를 등록, group router가 /api를 거치게됨 (ex: /api/groups)
app.use('/api', groupRouter);  

const PORT = process.env.PORT || 3000; //웹서버 포트

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    // 모든 모델을 동기화
    return sequelize.sync({ alter: true }); // alter: true는 기존 테이블을 변경할 수 있도록 설정    
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
  
export default app;
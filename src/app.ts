import express from 'express';
import sequelize from './models';
import dotenv from "dotenv";
import groupRouter from './routes/group.router';
import badgeRouter from './routes/badge.router';
import postRouter from './routes/post.router';
import { setupSwagger } from '../swagger'; // Swagger 설정 임포트
import BadgeService from './services/badge.service'; // BadgeService 임포트
import Group from './models/group.model'; // Group 모델 임포트
import Badge from './models/badge.model';


dotenv.config(); // .env 파일의 환경 변수를 불러옵니다

console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DBNAME:', process.env.DB_DBNAME);
console.log('DB_HOST:', process.env.DB_HOST);

const app = express();

app.use(express.json());

// Swagger 설정 추가
setupSwagger(app);

// '/api' prefix로 라우터를 등록, group router가 /api/groups를 거치게됨 (ex: /api/groups)
app.use('/api/groups', groupRouter);  
app.use('/api/badges', badgeRouter);
app.use('/api', postRouter);

const PORT = process.env.PORT || 3000; //웹서버 포트

sequelize.authenticate()
  .then(() => {
    console.log('연결에 성공했습니다.');

    // 모든 모델을 동기화
    return sequelize.sync(/*{ alter: true }*/); // alter: true는 기존 테이블을 변경할 수 있도록 설정    
  })
  .then(async() => {
    console.log('모든 모델 동기화에 성공했습니다.');

    await Badge.seedBadges(); // 시드 데이터 추가
    /*
        // 모든 그룹에 대해 뱃지 검토 및 부여
        const badgeService = new BadgeService();
        const groups = await sequelize.models.Group.findAll(); // 모든 그룹 조회
    
        for (const group of groups) {
          if (group instanceof Group) {
            await badgeService.awardBadges(group.id); // 각 그룹에 대해 뱃지 부여
          }
        }
          */
          
  })

  .catch((error) => {
    console.error('데이터베이스에 연결할 수 없습니다.:', error);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
export default app;
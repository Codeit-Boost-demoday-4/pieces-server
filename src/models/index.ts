import { Sequelize } from "sequelize";
import path from 'path';
import fs from 'fs';
import config from "../config/config";

const db: {
  [key: string]: any;
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
} = {};


const sequelize = new Sequelize(
  config.development.database, 
  config.development.username, 
  config.development.password, 
  {
    host: config.development.host,
    dialect: "mysql",
  }
);

// models 폴더의 모든 모델을 동적으로 가져옵니다.
const models: { [key: string]: any } = {};
const modelFiles = fs.readdirSync(path.join(__dirname))
  .filter(file => file.endsWith('.ts') && file !== 'index.ts');

for (const file of modelFiles) {
  const model = require(path.join(__dirname, file)).default;

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

export { sequelize, models };
export default sequelize;
import { Sequelize } from "sequelize";
import path from 'path';
import fs from 'fs/promises';
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

//models 폴더의 모든 모델을 동적으로 가져옴
const models: { [key: string]: any } = {};

const loadModels = async () => {
  try {
    //models 디렉토리에서 모든 파일을 읽어옴
    const modelFiles = (await fs.readdir(path.join(__dirname)))
      .filter(file => (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.js' && file !== 'index.ts');
    
      console.log('Model files:', modelFiles); //파일 목록 출력

    //각 파일에 대해 모델을 로드하고 초기화
    for (const file of modelFiles) {
      try {
        const model = (await import(path.join(__dirname, file))).default;

        if (model.initModel) {
          model.initModel(sequelize);
        }

        models[model.name] = model;
        console.log(`Loaded model ${model.name} from file ${file}`);
      } catch (error) {
        console.error(`Failed to load model from file ${file}:`, error);
      }
    }

    //모델 간의 관계 설정
    for (const modelName in models) {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    }
  } catch (error) {
    console.error('Failed to load models:', error);
  }
};

//모델을 로드합니다.
loadModels().catch(error => {
  console.error('Error during model loading:', error);
});

export { sequelize, models };
export default sequelize;

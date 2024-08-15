import dotenv from "dotenv"
dotenv.config() // .env 파일의 환경 변수를 불러옵니다

const config = {
  development : {
      username : process.env.DB_USERNAME || 'root',
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DBNAME || 'test',
      host : process.env.DB_HOST || 'localhost',
      dialect : "mysql",
      timezone: "+09:00", // timezone 설정
      dialectOptions: { charset: "utf8mb4", dateStrings: true, typeCast: true },
      define: {
        timestamps: true,
      },
  }

  
};

export default config
module.exports = config;
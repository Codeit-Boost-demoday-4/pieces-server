import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

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

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  };
const openapiSpecification = swaggerJsdoc(options);

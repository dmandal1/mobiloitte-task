import { Express, Request, Response } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Rest API Docs',
      version,
      description: 'API documentation for User API',
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: 'http://localhost:8000/', 
        },
      ],
  },
  apis: ['./src/routes/*.ts', '../models/*.ts'],
};

const specs = swaggerJsdoc(options);

export default (app: Express) => {
    // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

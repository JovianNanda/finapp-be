import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finapp API",
      version: "1.0.0",
      description: "API documentation for the Finapp application",
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
        url: "http://localhost:5000/api",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to your API docs
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    "📄 Swagger docs available at: http://localhost:5000/api/api-docs"
  );
}

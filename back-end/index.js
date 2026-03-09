import express from "express";
import router from "./router.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FrameLab Challenge API",
      version: "1.0.0",
      description: "Complete API documentation for the FrameLab Challenge Website and Desktop App. For managing creative challenges, entries, votes, and comments.",
      contact: {
        name: "Support",
        email: "support@framelab.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Api server",
      },
      {
        url: "http://localhost:5173",
        description: "Website",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "token",
          in: "cookie",
          name: "session",
          description: "JWT token stored in session cookie. Token expires in 1 year.",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token passed in Authorization header as Bearer token",
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints (login, register, logout)",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Challenges",
        description: "Challenge management endpoints",
      },
      {
        name: "Entries",
        description: "Challenge entry submission endpoints",
      },
      {
        name: "Votes",
        description: "Entry voting endpoints",
      },
      {
        name: "Comments",
        description: "Entry comment endpoints",
      },
    ],
  },
  apis: ["./router.js"],
};

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(8000);
app.use("/public", express.static("public"));

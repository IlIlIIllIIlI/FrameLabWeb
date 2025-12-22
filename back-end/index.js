import express from "express";
import router from "./router.js"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import cookieParser from "cookie-parser";


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'projetslam1',
            version: '1.0.0',
        },
    },
    apis: ['./router.js'], // files containing annotations as above
};


const app = express();

app.use(cookieParser())
app.use(express.json())
app.use("/api", router)

const swaggerSpec = swaggerJSDoc(options);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(8000)
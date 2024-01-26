
import express from 'express';
import routes from "./app/routes/routes";
import dotenv from 'dotenv';
import cors from 'cors';

//Carregando variaveis de ambiente
dotenv.config();

const server = express();
server.use(cors());
server.use(routes);


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor running on port ${port}, acess: http://localhost:${port}/`);
});
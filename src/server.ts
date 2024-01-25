
import express from 'express';
import routes from "./app/routes/routes";

const server = express();
server.use(routes);


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor running on port ${port}, acess: http://localhost:${port}/`);
});
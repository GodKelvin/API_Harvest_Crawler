import { Router } from "express";
import { Request, Response } from "express";
import psdRouter from "../controllers/psprices";

const routes = Router();
routes.get('/', async(_req: Request, res: Response) => {
  res.status(200).json({"Feito por: Kelvin Lehrback":"-> https://github.com/GodKelvin"});
});

routes.use("/ps-prices", psdRouter);

export default routes;
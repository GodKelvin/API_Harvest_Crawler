import { Request, Response, Router } from "express";
import { CrawlerPsdeals } from "../models/crawlerPsdeals";

const psdealsRouter = Router();

psdealsRouter.get("/", async(req: Request, res: Response): Promise<any> => {
  try{
    if(!req.query.search) return res.status(400).json({pendente: "params SEARCH nao foi identificado"});
    const crawler = new CrawlerPsdeals(String(req.query.search));
    let dataCrawler = await crawler.getDeals();
    return res.status(200).json({totalSearch: dataCrawler.length, results: dataCrawler});
  }catch(error){
    return res.status(500).json(`Internal Server Error => ${error}`);
  }
});

export default psdealsRouter;

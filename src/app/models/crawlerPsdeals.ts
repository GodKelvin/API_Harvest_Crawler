import { IPsdeals } from "../interfaces/psdeals";
import { launch } from "puppeteer";

export class CrawlerPsdeals{
  public static async getDeals(query: string): Promise<any>{
    return {search: query};
  }
}
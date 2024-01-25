import { IPsdeals } from "../interfaces/psdeals";
import { launch } from "puppeteer";

export class CrawlerPsdeals{
  private link: any = process.env.ALVO_CRAWLER_PSN;
  private busca: string;

  constructor(busca: string){
    this.busca = busca;
  }

  public async getDeals(): Promise<any>{
    return `${this.link}, ${this.busca}`;
  }
}
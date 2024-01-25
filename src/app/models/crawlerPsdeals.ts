import { IPsdeals } from "../interfaces/psdeals";
import { launch } from "puppeteer";

export class CrawlerPsdeals{
  private link: any = process.env.ALVO_CRAWLER_PSN;
  private busca: string;
  private completeGame = [null, "PACOTE DO JOGO", "EDIÇÃO PREMIUM"];
  private DLC = ["EXPANSÃO", "PACOTE DE EXPANSÕES"]



  constructor(busca: string){
    this.busca = busca;
  }

  public async getDeals(): Promise<any>{
    let deals = await this.scrapping();
    let response = deals;
    let i = 2;
    while(deals.length){
      deals = await this.scrapping(i);
      response = [...response, ...deals]
      i++;
    }
    return response;
  }


  private async scrapping(index=1){
    let browser = await launch({
      headless: 'new',
      args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote"
      ]
    });
    
    let page = await browser.newPage();

    //Acessa o endereco e aguarda que todas as tarefas de network estejam completas antes de crawlear
    await page.goto(`${this.link}/${this.busca}/${index}`, {
      waitUntil: "networkidle0",
      timeout: 0
    });

    await page.screenshot({path: "screenshot_page.png"});

    const pageContent: any = await page.evaluate(() => {
      //Procure todas as divs que comecam com "search#productTile" e terminam com "details"
      const divs = [...document.querySelectorAll('section[data-qa^="search#productTile"][data-qa$="#details"]')];

      //Chegou ao fim da busca
      if(!divs.length) return divs;

      //Para cada div, captura os dados dos jogos
      return divs.map((el: any) => {
        let type = el.querySelector("span[data-qa^='search#'][data-qa$='type']")?.innerText || "JOGO BASE";
        let name = el.querySelector("span[data-qa^='search#'][data-qa$='name']").innerText;
        let price = el.querySelector("span[data-qa^='search#'][data-qa$='price']").innerText;

        return {type, name, price};
      });
    });

    await browser.close();
    return pageContent;
  }
}
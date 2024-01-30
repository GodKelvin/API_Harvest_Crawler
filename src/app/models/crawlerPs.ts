import { IPsprices } from "../interfaces/psprices";
import { Browser, launch } from "puppeteer-core";

export class CrawlerPsdeals{
  private link: any = process.env.ALVO_CRAWLER_PSN;
  private busca: string;
  private completeGame = ["JOGO BASE", "PACOTE DO JOGO", "EDIÇÃO PREMIUM"];
  private DLC = ["EXPANSÃO", "PACOTE DE EXPANSÕES"];

  constructor(busca: string){
    this.busca = busca;
  }

  private async getBrowser(): Promise<Browser>{
    return await launch({
      headless: 'new',
      args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote"
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    });
  }

  public async getDeals(option:string = ""): Promise<IPsprices[]>{
    const browser = await this.getBrowser();
    const allDeals = [];
    let pageIndex = 1;
    let dealsOnPage;

    do{
      dealsOnPage = await this.scrapping(browser, pageIndex);
      allDeals.push(...dealsOnPage);
      pageIndex++;
    }while(dealsOnPage.length);
    browser.close();

    const dealsFilter = await this.filter(allDeals, option);
    return dealsFilter;
  }

  private async filter(deals: IPsprices[], option: string): Promise<IPsprices[]>{
    if(option == "jogo completo") deals = deals.filter(deal => this.completeGame.includes(deal.type))
    return deals;
  }

  private async scrapping(browser: Browser, index=1): Promise<IPsprices[]>{
    let page = await browser.newPage();
    //Acessa o endereco e aguarda que todas as tarefas de network estejam completas antes de crawlear
    await page.goto(`${this.link}/${this.busca}/${index}`, {
      waitUntil: "networkidle0",
      timeout: 0
    });

    //await page.screenshot({path: "screenshot_page.png"});

    let pageContent = await page.evaluate(() => {
      function getPreco(price: string): Number{
        if(!price) return 0;
        let cleanPrice = price.replace(',', '.').replace(/[^\d.]/g, '');
        return cleanPrice === "" ? 0 : Number(cleanPrice);
      }

      //Capturando a pagina do jogo
      const urlSegments = window.location.pathname.split('/');
      const pageId = urlSegments[urlSegments.length - 1];

      //Procure todas as divs que comecam com "search#productTile" e terminam com "details"
      const divs = [...document.querySelectorAll('section[data-qa^="search#productTile"][data-qa$="#details"]')];

      //Chegou ao fim da busca
      if(!divs.length) return divs;

      //Para cada div, captura os dados dos jogos
      return divs.map((el: any) => {
        let type = el.querySelector("span[data-qa^='search#'][data-qa$='type']")?.innerText || "JOGO BASE";
        let name = el.querySelector("span[data-qa^='search#'][data-qa$='name']")?.innerText || null;
        let price = el.querySelector("span[data-qa^='search#'][data-qa$='price']")?.innerText || null;

        return {type: type, name: name, price: getPreco(price), page: Number(pageId)};
      });
    }) as IPsprices[];
    return pageContent;
  }
}
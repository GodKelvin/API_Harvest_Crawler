import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
export class DiscordBot{
    private client: Client;
    constructor(){
        this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
        this.client.login(process.env.BOT_TOKEN).catch(console.error);
    }   

    public async sendMessage(message: string): Promise<void>{
        this.client.once("ready", async () => {
            const channel = this.client.channels.cache.get(String(process.env.CHANNEL_ID)) as TextChannel;
            if(channel){
                channel.send(message).catch(console.error);
            }
            return;
        })
    }

    public async sendJson(message: any): Promise<void>{
        this.client.once("ready", async () => {
            const channel = this.client.channels.cache.get(String(process.env.CHANNEL_ID)) as TextChannel;
            if(channel){
                channel.send(`\`\`\`json\n${message}\n\`\`\``).catch(console.error);
            }
            return;
        })
    }
}
import { GatewayIntentBits } from 'discord.js';

const Discord = require('discord.js');
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login('MTE3NDAyNzUzNzg0OTAwNDA2NA.GTCKD-.mTl5ceSdKXwfMB9JIXpE604aXGqCeuf9hXHhV0');

export function sendDiscordNotification(message: string) {
    const channelId = '1174027314598789160';
    const _message = message;

    const channel = client.channels.cache.get(channelId);

    if (channel && channel.type === 0) {
        channel.send(_message);
    } else {
        console.log('Salon introuvable ou type incorrect.');
    }
}
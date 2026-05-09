require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const logger = require('./utils/logger');

const fs = require('fs');

logger.premiumBrand();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
});

client.commands = new Collection();
client.events = new Collection();
client.components = new Collection();

// Anti-crash system
process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});
process.on('uncaughtException', (err, origin) => {
  logger.error(`Uncaught Exception: ${err}`);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  logger.error(`Uncaught Exception Monitor: ${err}`);
});

// Load Handlers
const handlers = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
for (const handler of handlers) {
  require(`./handlers/${handler}`)(client);
}

// Login
if (process.env.TOKEN && process.env.TOKEN !== 'your_bot_token_here') {
  client.login(process.env.TOKEN).catch(err => logger.error(`Login failed: ${err.message}`));
} else {
  logger.warn('Please provide a valid bot token in the .env file.');
}

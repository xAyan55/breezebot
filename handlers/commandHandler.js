const fs = require('fs');
const logger = require('../utils/logger');
const { REST, Routes } = require('discord.js');

module.exports = (client) => {
  let commandsArray = [];
  let count = 0;

  const commandFolders = fs.readdirSync('./commands');
  for (const folder of commandFolders) {
    if (!fs.statSync(`./commands/${folder}`).isDirectory()) continue;
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        count++;
      }
    }
  }

  logger.cmd(`Loaded ${count} commands.`);
  
  // Register commands on ready
  client.once('ready', async () => {
    try {
      if (!process.env.CLIENT_ID || !process.env.TOKEN || process.env.TOKEN === 'your_bot_token_here') return;
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
      logger.info('Started refreshing application (/) commands.');
      
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commandsArray },
      );
      
      logger.success('Successfully reloaded application (/) commands.');
    } catch (error) {
      logger.error(`Error reloading commands: ${error.message}`);
    }
  });
};

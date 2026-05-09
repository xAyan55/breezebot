const LocalDB = require('../database/localDB');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const guildConfig = LocalDB.getGuild(message.guild.id);
    if (!guildConfig || !guildConfig.triggers) return;

    const content = message.content.toLowerCase();
    
    // Check for triggers
    for (const trigger of guildConfig.triggers) {
      // Create regex to match whole words only to prevent accidental triggers in longer words
      const regex = new RegExp(`\\b${trigger.word}\\b`, 'i');
      if (regex.test(content)) {
        await message.reply({ content: trigger.reply });
        break;
      }
    }
  }
};

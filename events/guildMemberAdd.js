const PremiumEmbed = require('../utils/embedBuilder');
const LocalDB = require('../database/localDB');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const guildConfig = LocalDB.getGuild(member.guild.id);

    if (!guildConfig || !guildConfig.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
    if (!channel) return;

    const embed = new PremiumEmbed()
      .setPremium(`Welcome to ${member.guild.name}!`, 
        `Hey ${member}, welcome to **${member.guild.name}**!\n\n` +
        `> ${config.emojis.premium} Make sure to read the rules.\n` +
        `> ${config.emojis.ticket} Need help? Open a ticket!\n` +
        `> 📊 You are our **${member.guild.memberCount}th** member.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setImage('https://i.imgur.com/g4AJ3JM.jpeg'); // Custom welcome banner

    try {
      await channel.send({ content: `${member}`, embeds: [embed] });
    } catch (err) {
      logger.error(`Failed to send welcome message: ${err}`);
    }

    // Auto-role logic
    if (guildConfig.autoRole) {
      const role = member.guild.roles.cache.get(guildConfig.autoRole);
      if (role) {
        member.roles.add(role).catch(err => logger.error(`Auto-role error: ${err}`));
      }
    }
  }
};

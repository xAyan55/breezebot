const LocalDB = require('../../database/localDB');
const config = require('../../config/config');

module.exports = {
  customId: 'verify_button',
  async execute(interaction) {
    const guildConfig = LocalDB.getGuild(interaction.guild.id);
    
    if (!guildConfig || !guildConfig.verifiedRole) {
      return interaction.reply({ content: 'Verification is not configured correctly on this server.', ephemeral: true });
    }

    const role = interaction.guild.roles.cache.get(guildConfig.verifiedRole);
    if (!role) {
      return interaction.reply({ content: 'The verification role could not be found.', ephemeral: true });
    }

    if (interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ content: 'You are already verified!', ephemeral: true });
    }

    try {
      await interaction.member.roles.add(role);
      await interaction.reply({ content: `${config.emojis.success} You have been successfully verified! Welcome to the server!`, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: 'I do not have permission to give you the verified role.', ephemeral: true });
    }
  }
};

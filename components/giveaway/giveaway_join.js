const LocalDB = require('../../database/localDB');

module.exports = {
  customId: 'giveaway_join',
  async execute(interaction) {
    const guildConfig = LocalDB.getGuild(interaction.guild.id);
    
    if (!guildConfig || !guildConfig.activeGiveaway) {
      return interaction.reply({ content: 'This giveaway has ended or is invalid.', ephemeral: true });
    }

    const entries = guildConfig.activeGiveaway.entries || [];
    
    if (entries.includes(interaction.user.id)) {
      return interaction.reply({ content: 'You have already joined this giveaway!', ephemeral: true });
    }

    entries.push(interaction.user.id);
    guildConfig.activeGiveaway.entries = entries;
    LocalDB.updateGuild(interaction.guild.id, { activeGiveaway: guildConfig.activeGiveaway });

    await interaction.reply({ content: '🎉 You have successfully joined the giveaway!', ephemeral: true });
  }
};

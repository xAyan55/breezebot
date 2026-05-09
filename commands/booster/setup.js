const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LocalDB = require('../../database/localDB');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('booster')
    .setDescription('Manage the booster alert system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Set the channel for booster alerts')
        .addChannelOption(option => 
          option.setName('channel')
            .setDescription('The channel to send booster alerts in')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    
    LocalDB.updateGuild(interaction.guild.id, { boosterChannel: channel.id });
    
    await interaction.reply({ 
      content: `${config.emojis.success} Booster alerts will now be sent to ${channel}!`, 
      ephemeral: true 
    });
  }
};

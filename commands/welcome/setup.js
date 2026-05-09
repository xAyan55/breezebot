const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const PremiumEmbed = require('../../utils/embedBuilder');
const LocalDB = require('../../database/localDB');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure the premium welcome system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('Set the welcome channel')
        .addChannelOption(option => 
          option.setName('channel')
            .setDescription('The channel to send welcome messages in')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    
    // Update local JSON DB
    LocalDB.updateGuild(interaction.guild.id, { welcomeChannel: channel.id });

    const embed = new PremiumEmbed()
      .setSuccess(`Successfully set the welcome channel to ${channel}.\n\nNew members will now receive a premium welcome message in this channel.`);

    await interaction.reply({ embeds: [embed] });
  }
};

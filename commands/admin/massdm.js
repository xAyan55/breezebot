const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PremiumEmbed = require('../../utils/embedBuilder');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('massdm')
    .setDescription('Send a mass DM to all members (Rate limited)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const messageContent = interaction.options.getString('message');
    const members = await interaction.guild.members.fetch();
    
    // Filter out bots
    const targetMembers = members.filter(m => !m.user.bot);

    const embed = new PremiumEmbed()
      .setPremium('Server Announcement', messageContent);

    let successCount = 0;
    let failCount = 0;

    await interaction.editReply({ content: `${config.emojis.settings} Starting Mass DM to ${targetMembers.size} members... This may take a while.` });

    for (const member of targetMembers.values()) {
      try {
        await member.send({ embeds: [embed] });
        successCount++;
      } catch (err) {
        failCount++;
      }
      
      // Sleep to prevent API rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds per message
    }

    await interaction.editReply({ 
      content: `${config.emojis.success} Mass DM completed!\n` +
      `**Successfully sent:** ${successCount}\n` +
      `**Failed (DMs closed):** ${failCount}` 
    });
  }
};

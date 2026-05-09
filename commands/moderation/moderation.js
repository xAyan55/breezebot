const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PremiumEmbed = require('../../utils/embedBuilder');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moderation')
    .setDescription('Advanced moderation commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName('purge')
        .setDescription('Delete multiple messages')
        .addIntegerOption(option => 
          option.setName('amount')
            .setDescription('Number of messages to delete (1-100)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking').setRequired(false))
    ),

  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'purge') {
      const amount = interaction.options.getInteger('amount');
      await interaction.channel.bulkDelete(amount, true);
      const embed = new PremiumEmbed().setSuccess(`Successfully deleted **${amount}** messages.`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (subcommand === 'kick') {
      const target = interaction.options.getMember('target');
      const reason = interaction.options.getString('reason') || 'No reason provided.';

      if (!target.kickable) {
        return interaction.reply({ embeds: [new PremiumEmbed().setError('I cannot kick this user.')], ephemeral: true });
      }

      await target.kick(reason);
      const embed = new PremiumEmbed().setSuccess(`Successfully kicked **${target.user.tag}**.\nReason: ${reason}`);
      await interaction.reply({ embeds: [embed] });
    }
  }
};

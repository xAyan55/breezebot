const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { LayoutView, Container } = require('../../utils/componentsV2');
const LocalDB = require('../../database/localDB');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trigger')
    .setDescription('Auto-reply trigger system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a new auto-reply trigger')
        .addStringOption(option => option.setName('word').setDescription('The word to trigger on').setRequired(true))
        .addStringOption(option => option.setName('reply').setDescription('The bot\'s reply').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove an auto-reply trigger')
        .addStringOption(option => option.setName('word').setDescription('The exact word to remove').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all auto-reply triggers')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildConfig = LocalDB.getGuild(interaction.guild.id) || {};
    let triggers = guildConfig.triggers || [];

    if (subcommand === 'add') {
      const word = interaction.options.getString('word').toLowerCase();
      const reply = interaction.options.getString('reply');

      // Check if word already exists
      if (triggers.some(t => t.word === word)) {
        return interaction.reply({ content: `A trigger for **${word}** already exists.`, ephemeral: true });
      }

      triggers.push({ word, reply });
      LocalDB.updateGuild(interaction.guild.id, { triggers });

      await interaction.reply({ content: `${config.emojis.success} Successfully added trigger for word: **${word}**`, ephemeral: true });
    
    } else if (subcommand === 'remove') {
      const word = interaction.options.getString('word').toLowerCase();
      
      const initialLength = triggers.length;
      triggers = triggers.filter(t => t.word !== word);

      if (triggers.length === initialLength) {
        return interaction.reply({ content: `Could not find a trigger for **${word}**.`, ephemeral: true });
      }

      LocalDB.updateGuild(interaction.guild.id, { triggers });
      await interaction.reply({ content: `${config.emojis.success} Successfully removed trigger for word: **${word}**`, ephemeral: true });
    
    } else if (subcommand === 'list') {
      if (triggers.length === 0) {
        return interaction.reply({ content: 'There are no active triggers in this server.', ephemeral: true });
      }

      let description = '### Active Triggers\n\n';
      triggers.forEach((t, i) => {
        description += `**${i + 1}.** \`${t.word}\` ➔ ${t.reply}\n`;
      });

      const layout = new LayoutView();
      const container = new Container({ accentColor: config.colors.primary })
        .addText(description);
      layout.addContainer(container);

      await layout.replyTo(interaction);
    }
  }
};

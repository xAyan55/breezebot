const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { ComponentsV2 } = require('../../utils/componentsV2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a premium embed message')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Open the interactive embed builder modal')
        .addStringOption(option => option.setName('button_name').setDescription('Optional text for a button on the embed').setRequired(false))
        .addStringOption(option => option.setName('button_link').setDescription('Optional URL for the button').setRequired(false))
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === 'create') {
      const buttonName = interaction.options.getString('button_name');
      const buttonLink = interaction.options.getString('button_link');

      if ((buttonName && !buttonLink) || (!buttonName && buttonLink)) {
        return interaction.reply({ content: 'If you want to add a button, you must provide BOTH a button name and a button link.', ephemeral: true });
      }

      const embedCache = require('../../components/embed/embed_cache');
      embedCache.set(interaction.user.id, { buttonName, buttonLink });

      const modal = ComponentsV2.createModal({
        customId: 'embed_builder_modal',
        title: 'Premium Embed Builder',
        inputs: [
          { customId: 'embed_title', label: 'Embed Title', style: 'short', required: false },
          { customId: 'embed_desc', label: 'Embed Description', style: 'paragraph', required: true },
          { customId: 'embed_color', label: 'Hex Color Code (e.g. #00a8ff)', style: 'short', required: false, placeholder: '#00a8ff' },
          { customId: 'embed_image', label: 'Image URL', style: 'short', required: false },
          { customId: 'embed_thumbnail', label: 'Thumbnail URL', style: 'short', required: false }
        ]
      });

      await interaction.showModal(modal);
    }
  }
};

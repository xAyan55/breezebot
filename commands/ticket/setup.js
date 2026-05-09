const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Advanced ticket system commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup the ticket panel in the current channel')
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === 'setup') {
      const layout = new LayoutView();

      const container = new Container({ accentColor: config.colors.primary })
        .addText(`### Contact BreezeBytes Support\n\n` +
          `Welcome to the **${config.brandName}** support center!\n\n` +
          `Please select the appropriate category below to open a ticket. Our staff team will be with you shortly.\n\n` +
          `> ${config.emojis.ticket} **General Support** - Questions & Inquiries\n` +
          `> ${config.emojis.premium} **Sales** - Upgrades & Billing\n` +
          `> ${config.emojis.settings} **Technical** - Server issues & Bug reports`
        );

      const selectMenu = ComponentsV2.createSelectMenu({
        customId: 'ticket_create_menu',
        placeholder: 'Select a ticket category...',
        options: [
          { label: 'General Support', description: 'General questions and help', value: 'support', emoji: config.emojis.ticket },
          { label: 'Sales & Billing', description: 'Upgrades, payments, refunds', value: 'sales', emoji: config.emojis.premium },
          { label: 'Technical Support', description: 'Server issues, bugs, errors', value: 'tech', emoji: config.emojis.settings }
        ]
      });

      container.addRawComponent({ type: 1, components: [selectMenu] });
      layout.addContainer(container);

      await layout.sendToChannel(interaction.channel);
      await interaction.reply({ content: `${config.emojis.success} Ticket panel has been set up successfully.`, ephemeral: true });
    }
  }
};

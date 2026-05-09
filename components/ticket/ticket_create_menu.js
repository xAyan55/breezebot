const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  customId: 'ticket_create_menu',
  async execute(interaction, client) {
    const category = interaction.values[0];
    const guild = interaction.guild;
    const user = interaction.user;

    await interaction.deferReply({ ephemeral: true });

    // Try to find category or create one
    let parentCategory = guild.channels.cache.find(c => c.name === 'Tickets' && c.type === ChannelType.GuildCategory);
    if (!parentCategory) {
      parentCategory = await guild.channels.create({
        name: 'Tickets',
        type: ChannelType.GuildCategory,
      });
    }

    // Create the ticket channel
    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: ChannelType.GuildText,
      parent: parentCategory.id,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
        {
          id: client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        }
      ],
    });

    const layout = new LayoutView();
    const container = new Container({ accentColor: config.colors.primary })
      .addText(`### Ticket: ${category.toUpperCase()}\n\n` +
        `Welcome ${user} to your ticket!\n\n` +
        `Our support team will be with you shortly. Please describe your issue in detail.\n` +
        `**Category:** ${category}`
      );

    const btnRow = {
      type: 1,
      components: [
        ComponentsV2.createButton({ customId: `ticket_close`, label: 'Close Ticket', style: 4, emoji: '🔒' }),
        ComponentsV2.createButton({ customId: `ticket_claim`, label: 'Claim', style: 3, emoji: '📌' })
      ]
    };
    
    container.addRawComponent(btnRow);
    layout.addContainer(container);

    await layout.sendToChannel(ticketChannel);
    
    await interaction.editReply({ content: `${config.emojis.success} Ticket created successfully: ${ticketChannel}` });
  }
};

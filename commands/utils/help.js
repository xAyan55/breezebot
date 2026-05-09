const { SlashCommandBuilder } = require('discord.js');
const { LayoutView, Container, Section, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display the premium help menu'),

  async execute(interaction, client) {
    const layout = new LayoutView();

    const mainContainer = new Container({ accentColor: config.colors.primary })
      .addText(`### BreezeBytes | Premium Bot Control Panel\n\n` +
        `Welcome to the **BreezeBytes** official bot!\n` +
        `This bot is engineered with cutting-edge technology to provide you with the most seamless and robust experience possible.\n\n` +
        `**${config.emojis.premium} Features:**\n` +
        `> ${config.emojis.ticket} **Ticket System:** Fully customizable support panels\n` +
        `> ${config.emojis.settings} **Moderation:** Advanced filtering and moderation tools\n` +
        `> 🌟 **Review System:** Collect and showcase user feedback\n` +
        `> 📝 **Embed Builder:** Interactive UI for creating beautiful messages\n\n` +
        `Navigate the menus below to explore all commands!`
      );

    const selectMenu = ComponentsV2.createSelectMenu({
      customId: 'help_category_menu',
      placeholder: 'Browse Command Categories...',
      options: [
        { label: 'General / Setup', description: 'Bot configuration & setup', value: 'setup', emoji: '⚙️' },
        { label: 'Tickets', description: 'Ticket management commands', value: 'tickets', emoji: '🎫' },
        { label: 'Moderation', description: 'Server security commands', value: 'mod', emoji: '🛡️' }
      ]
    });

    // Add select menu in its own action row object directly to container
    mainContainer.addRawComponent({ type: 1, components: [selectMenu] });

    // Important Links
    mainContainer.addText("**Important Links**");
    const linkRow = {
      type: 1,
      components: [
        ComponentsV2.createButton({ url: 'https://breezebytes.com', label: 'Website', style: 5, emoji: '🌐' }),
        ComponentsV2.createButton({ url: 'https://panel.breezebytes.com', label: 'Dashboard', style: 5, emoji: '💻' })
      ]
    };
    
    mainContainer.addRawComponent(linkRow);

    layout.addContainer(mainContainer);

    // Reply using raw API
    await layout.replyTo(interaction);
  }
};

const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  customId: 'help_category_menu',
  async execute(interaction, client) {
    const value = interaction.values[0];
    
    const layout = new LayoutView();
    const container = new Container({ accentColor: config.colors.primary });

    if (value === 'setup') {
      container.addText(`### ⚙️ General & Setup Commands\n` +
        `> \`/welcome channel\` - Configure the welcome channel.\n` +
        `> \`/ticket setup\` - Deploy a ticket panel to a channel.\n`
      );
    } else if (value === 'tickets') {
      container.addText(`### 🎫 Ticket Management\n` +
        `> \`/ticket setup\` - Deploy a ticket panel to a channel.\n` +
        `*More ticket commands coming soon!*`
      );
    } else if (value === 'mod') {
      container.addText(`### 🛡️ Moderation Commands\n` +
        `> \`/moderation kick\` - Kick a user from the server.\n` +
        `> \`/moderation purge\` - Bulk delete messages in a channel.\n`
      );
    } else {
      container.addText(`### Unknown Category selected.`);
    }

    layout.addContainer(container);

    // We use the raw REST post because discord.js v14 doesn't support IS_COMPONENTS_V2 payloads in interaction.reply yet
    await interaction.client.rest.post(
      require('discord.js').Routes.interactionCallback(interaction.id, interaction.token),
      {
        body: {
          type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
          data: {
            flags: 32768 | 64, // IS_COMPONENTS_V2 (32768) + EPHEMERAL (64)
            components: layout.toJSON()
          }
        }
      }
    );
  }
};

const { Routes } = require('discord.js');
const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  customId: 'review_deny',
  async execute(interaction, client) {
    // Reconstruct the layout to show it was denied
    const layout = new LayoutView();
    const container = new Container({ accentColor: '#e84118' }) // Red for denied
      .addText(`### ❌ REVIEW DENIED\n\nThis review was officially denied by ${interaction.user.tag}.`);

    layout.addContainer(container);

    // Update the original message via REST to preserve V2 flags
    await client.rest.post(
      Routes.interactionCallback(interaction.id, interaction.token),
      {
        body: {
          type: 7, // UPDATE_MESSAGE
          data: {
            flags: 32768, // IS_COMPONENTS_V2
            components: layout.toJSON()
          }
        }
      }
    );
  }
};

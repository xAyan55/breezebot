const { Routes } = require('discord.js');
const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  customId: 'review_approve',
  async execute(interaction, client) {
    // Reconstruct the layout to show it was approved
    const layout = new LayoutView();
    const container = new Container({ accentColor: '#44bd32' }) // Green for approved
      .addText(`### ✅ REVIEW APPROVED\n\nThis review was officially approved by ${interaction.user.tag}.`);

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

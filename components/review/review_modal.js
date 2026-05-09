const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const LocalDB = require('../../database/localDB');
const config = require('../../config/config');
const reviewCache = require('./review_cache');

module.exports = {
  customId: 'review_modal_final',
  async execute(interaction, client) {
    const text = interaction.fields.getTextInputValue('review_text');
    
    const state = reviewCache.get(interaction.user.id) || { stars: '5', type: 'free' };
    let starsNum = parseInt(state.stars);
    
    if (isNaN(starsNum) || starsNum < 1) starsNum = 1;
    if (starsNum > 5) starsNum = 5;

    const typeStr = state.type === 'paid' ? 'Premium Paid Service 💎' : 'Free Service 🎁';

    const starsStr = '⭐'.repeat(starsNum);

    // Create final Review Layout
    const layout = new LayoutView();
    const container = new Container({ accentColor: config.colors.primary })
      .addText(`### New Review: ${interaction.user.tag}\n\n` +
        `**Rating:** ${starsStr} (${starsNum}/5)\n` +
        `**Service Type:** ${typeStr}\n\n` +
        `**Feedback:**\n> ${text}`
      );
      
    layout.addContainer(container);

    // Send directly to the specified review channel ID
    const reviewChannelId = '1502326711797157991';
    const channel = interaction.client.channels.cache.get(reviewChannelId);
    
    if (channel) {
      await layout.sendToChannel(channel);
    } else {
      // Fallback if bot cannot see the channel yet
      await layout.sendToChannel(interaction.channel);
    }

    await interaction.reply({ content: `${config.emojis.success} Your review has been submitted for approval. Thank you!`, ephemeral: true });
  }
};

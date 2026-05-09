const { ComponentsV2 } = require('../../utils/componentsV2');
const reviewCache = require('./review_cache');

module.exports = {
  customId: 'review_write_btn',
  async execute(interaction) {
    const state = reviewCache.get(interaction.user.id);
    
    if (!state || !state.stars || !state.type) {
      return interaction.reply({ content: 'Please select both a Star Rating and a Service Type before writing your review!', ephemeral: true });
    }

    const modal = ComponentsV2.createModal({
      customId: 'review_modal_final',
      title: 'Submit Review',
      inputs: [
        { customId: 'review_text', label: 'Your Feedback', style: 'paragraph', required: true, placeholder: 'Write your experience with BreezeBytes...' }
      ]
    });

    await interaction.showModal(modal);
  }
};

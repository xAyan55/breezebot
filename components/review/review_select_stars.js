const reviewCache = require('./review_cache');

module.exports = {
  customId: 'review_select_stars',
  async execute(interaction) {
    const value = interaction.values[0];
    
    let state = reviewCache.get(interaction.user.id) || {};
    state.stars = value;
    reviewCache.set(interaction.user.id, state);

    await interaction.reply({ content: `✅ Selected **${value} Stars**!`, ephemeral: true });
  }
};

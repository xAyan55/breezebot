const { SlashCommandBuilder } = require('discord.js');
const { ComponentsV2 } = require('../../utils/componentsV2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Submit a premium review for BreezeBytes')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Write a review')
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === 'create') {
      const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
      const config = require('../../config/config');

      const layout = new LayoutView();
      const container = new Container({ accentColor: config.colors.primary })
        .addText(`### Submit a Review\n\n` +
          `Please select your star rating and the service type you are reviewing.\n` +
          `Once selected, click the **Write Review** button to type your feedback!`
        );

      const starsMenu = ComponentsV2.createSelectMenu({
        customId: 'review_select_stars',
        placeholder: 'Select a Star Rating...',
        options: [
          { label: '5 Stars - Excellent', value: '5', emoji: '🌟' },
          { label: '4 Stars - Good', value: '4', emoji: '✨' },
          { label: '3 Stars - Average', value: '3', emoji: '⭐' },
          { label: '2 Stars - Poor', value: '2', emoji: '📉' },
          { label: '1 Star - Terrible', value: '1', emoji: '⚠️' }
        ]
      });

      const typeMenu = ComponentsV2.createSelectMenu({
        customId: 'review_select_type',
        placeholder: 'Select Service Type...',
        options: [
          { label: 'Premium Paid Service', value: 'paid', emoji: '💎' },
          { label: 'Free Service', value: 'free', emoji: '🎁' }
        ]
      });

      const writeBtn = {
        type: 1,
        components: [
          ComponentsV2.createButton({ customId: 'review_write_btn', label: 'Write Review', style: 3, emoji: '📝' })
        ]
      };

      container.addRawComponent({ type: 1, components: [starsMenu] });
      container.addRawComponent({ type: 1, components: [typeMenu] });
      container.addRawComponent(writeBtn);
      
      layout.addContainer(container);

      await layout.replyTo(interaction, true);
    }
  }
};

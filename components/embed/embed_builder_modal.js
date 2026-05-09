const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');

module.exports = {
  customId: 'embed_builder_modal',
  async execute(interaction, client) {
    const title = interaction.fields.getTextInputValue('embed_title');
    const description = interaction.fields.getTextInputValue('embed_desc');
    const color = interaction.fields.getTextInputValue('embed_color');
    const image = interaction.fields.getTextInputValue('embed_image');
    const thumbnail = interaction.fields.getTextInputValue('embed_thumbnail');

    const embedCache = require('./embed_cache');
    const cachedData = embedCache.get(interaction.user.id) || {};
    const { buttonName, buttonLink } = cachedData;

    const layout = new LayoutView();
    const container = new Container({ accentColor: color || config.colors.primary });

    let content = '';
    if (title) content += `### ${title}\n\n`;
    content += description;

    // Discord will automatically embed direct image links if placed in text
    if (thumbnail) content += `\n\n**[Thumbnail](${thumbnail})**`;
    if (image) content += `\n\n${image}`;

    container.addText(content);

    if (buttonName && buttonLink) {
      container.addRawComponent({
        type: 1,
        components: [
          ComponentsV2.createButton({ label: buttonName, url: buttonLink, style: 5 })
        ]
      });
      embedCache.delete(interaction.user.id);
    }

    layout.addContainer(container);

    await layout.sendToChannel(interaction.channel);
    await interaction.reply({ content: `${config.emojis.success} Premium V2 Embed successfully sent to the channel!`, ephemeral: true });
  }
};

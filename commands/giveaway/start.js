const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');
const LocalDB = require('../../database/localDB');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Advanced button-based giveaway system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a new giveaway')
        .addStringOption(option => option.setName('prize').setDescription('The prize to give away').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Duration (e.g., 1h, 1d)').setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(true))
    ),

  async execute(interaction) {
    const prize = interaction.options.getString('prize');
    const durationStr = interaction.options.getString('duration');
    const winnersCount = interaction.options.getInteger('winners');

    const durationMs = ms(durationStr);
    if (!durationMs) return interaction.reply({ content: 'Invalid duration format.', ephemeral: true });

    const endsAt = Date.now() + durationMs;
    const endsTimestamp = Math.floor(endsAt / 1000);

    const layout = new LayoutView();
    const container = new Container({ accentColor: config.colors.primary })
      .addText(`### 🎉 GIVEAWAY: ${prize} 🎉\n\n` +
        `**Hosted by:** ${interaction.user}\n` +
        `**Winners:** ${winnersCount}\n` +
        `**Ends:** <t:${endsTimestamp}:R>\n\n` +
        `> Click the **Join** button below to enter!`
      );

    const btnRow = {
      type: 1,
      components: [
        ComponentsV2.createButton({ customId: `giveaway_join`, label: '0 Entries', style: 1, emoji: '🎉' })
      ]
    };
    
    container.addRawComponent(btnRow);
    layout.addContainer(container);

    const msgResponse = await layout.sendToChannel(interaction.channel);

    // Save giveaway state in DB or memory (mocking for now with LocalDB)
    LocalDB.updateGuild(interaction.guild.id, { 
      activeGiveaway: { 
        prize, 
        endsAt, 
        winnersCount, 
        entries: [],
        messageId: msgResponse.id,
        channelId: interaction.channel.id,
        hostId: interaction.user.id
      } 
    });

    await interaction.reply({ content: `${config.emojis.success} Giveaway started successfully!`, ephemeral: true });
  }
};

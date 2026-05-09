module.exports = {
  customId: 'ticket_claim',
  async execute(interaction) {
    await interaction.reply({ content: `This ticket has been claimed by ${interaction.user}.`, ephemeral: false });
  }
};

module.exports = {
  customId: 'ticket_close',
  async execute(interaction) {
    await interaction.reply({ content: 'Ticket will be closed in 5 seconds...', ephemeral: false });
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  }
};

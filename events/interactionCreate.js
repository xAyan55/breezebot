const logger = require('../utils/logger');
const PremiumEmbed = require('../utils/embedBuilder');

module.exports = {
  name: 'interactionCreate',
  execute: async (interaction, client) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        logger.error(`Command execution error: ${error}`);
        const errorEmbed = new PremiumEmbed().setError('There was an error while executing this command.');
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      }
    } else if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
      // Extract base ID by matching known component prefixes
      let component = client.components.get(interaction.customId);
      
      if (!component) {
        // Find a component whose customId is a prefix of the interaction's customId
        for (const [key, comp] of client.components.entries()) {
          if (interaction.customId.startsWith(key + '_')) {
            component = comp;
            break;
          }
        }
      }
      
      if (!component) return;

      try {
        await component.execute(interaction, client);
      } catch (error) {
        logger.error(`Component execution error: ${error}`);
        const errorEmbed = new PremiumEmbed().setError('There was an error while interacting with this component.');
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      }
    }
  }
};

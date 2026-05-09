const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { LayoutView, Container, ComponentsV2 } = require('../../utils/componentsV2');
const config = require('../../config/config');
const LocalDB = require('../../database/localDB');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verification')
    .setDescription('Setup the verification panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Deploy a verification panel to the current channel')
        .addRoleOption(option => 
          option.setName('role')
            .setDescription('The role to give upon verification')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const verifiedRole = interaction.options.getRole('role');

    const layout = new LayoutView();
    const container = new Container({ accentColor: config.colors.primary })
      .addText(`### Server Verification\n\n` +
        `To gain access to the rest of the server, you must complete the verification process.\n\n` +
        `By clicking the verify button below, you agree to follow all server rules and guidelines.`
      );

    const btnRow = {
      type: 1,
      components: [
        ComponentsV2.createButton({ customId: `verify_button`, label: 'Verify Here', style: 3, emoji: '✅' })
      ]
    };
    
    container.addRawComponent(btnRow);
    layout.addContainer(container);

    await layout.sendToChannel(interaction.channel);

    LocalDB.updateGuild(interaction.guild.id, { verifiedRole: verifiedRole.id });

    await interaction.reply({ content: `${config.emojis.success} Verification panel deployed successfully.`, ephemeral: true });
  }
};

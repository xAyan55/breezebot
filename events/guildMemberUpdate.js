const { LayoutView, Container } = require('../utils/componentsV2');
const LocalDB = require('../database/localDB');
const config = require('../config/config');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    // Check if the user just boosted the server
    const justBoosted = !oldMember.premiumSince && newMember.premiumSince;
    
    if (justBoosted) {
      const guildConfig = LocalDB.getGuild(newMember.guild.id);
      if (!guildConfig || !guildConfig.boosterChannel) return;

      const channel = newMember.guild.channels.cache.get(guildConfig.boosterChannel);
      if (!channel) return;

      const layout = new LayoutView();
      const container = new Container({ accentColor: '#ff73fa' }) // Booster Pink
        .addText(`### 🚀 NEW SERVER BOOSTER!\n\n` +
          `Thank you so much **${newMember.user.tag}** for boosting **${newMember.guild.name}**!\n` +
          `Your support helps us grow and unlock awesome new features for everyone. 💖`
        );
        
      layout.addContainer(container);
      await layout.sendToChannel(channel);
    }
  }
};

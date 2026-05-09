const logger = require('../utils/logger');
const { ActivityType } = require('discord.js');

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    logger.success(`Logged in as ${client.user.tag}!`);
    
    // Dynamic Bot Status Rotation
    const statuses = [
      { name: 'BreezeBytes Hosting', type: ActivityType.Watching },
      { name: '/help | Premium Support', type: ActivityType.Listening },
      { name: 'Managing Tickets 🎫', type: ActivityType.Playing }
    ];

    let i = 0;
    setInterval(() => {
      client.user.setActivity(statuses[i]);
      i = (i + 1) % statuses.length;
    }, 15000); // Rotate every 15 seconds

    // Giveaway Timer Checker
    const LocalDB = require('../database/localDB');
    const { LayoutView, Container } = require('../utils/componentsV2');
    
    setInterval(async () => {
      const now = Date.now();
      
      for (const [guildId, guildConfig] of Object.entries(LocalDB.data.guilds)) {
        const giveaway = guildConfig.activeGiveaway;
        
        if (giveaway && now >= giveaway.endsAt) {
          try {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) continue;
            
            const channel = guild.channels.cache.get(giveaway.channelId);
            if (!channel) continue;

            const entries = giveaway.entries || [];
            const numWinners = Math.min(giveaway.winnersCount, entries.length);
            let winnerMentions = '';

            if (numWinners === 0) {
              winnerMentions = 'No one entered! 😢';
            } else {
              // Shuffle and pick winners
              const shuffled = entries.sort(() => 0.5 - Math.random());
              const winners = shuffled.slice(0, numWinners);
              winnerMentions = winners.map(id => `<@${id}>`).join(', ');
            }

            const layout = new LayoutView();
            const container = new Container({ accentColor: '#f1c40f' })
              .addText(`### 🎉 GIVEAWAY ENDED: ${giveaway.prize} 🎉\n\n` +
                `**Winners:** ${winnerMentions}\n` +
                `**Hosted by:** <@${giveaway.hostId}>\n\n` +
                `*Congratulations to the winners! Open a ticket to claim your prize.*`
              );
              
            layout.addContainer(container);
            await layout.sendToChannel(channel);

            // Clear giveaway state
            LocalDB.updateGuild(guildId, { activeGiveaway: null });

          } catch (err) {
            logger.error(`Error ending giveaway in guild ${guildId}: ${err}`);
          }
        }
      }
    }, 10000); // Check every 10 seconds
  }
};

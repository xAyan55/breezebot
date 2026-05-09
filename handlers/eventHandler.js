const fs = require('fs');
const logger = require('../utils/logger');

module.exports = (client) => {
  let count = 0;
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    count++;
  }
  
  logger.event(`Loaded ${count} events.`);
};

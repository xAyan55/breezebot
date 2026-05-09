const fs = require('fs');
const logger = require('../utils/logger');

module.exports = (client) => {
  let count = 0;
  
  if (!fs.existsSync('./components')) return;

  const componentFolders = fs.readdirSync('./components');
  for (const folder of componentFolders) {
    if (!fs.statSync(`./components/${folder}`).isDirectory()) continue;
    
    const componentFiles = fs.readdirSync(`./components/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of componentFiles) {
      const component = require(`../components/${folder}/${file}`);
      if (component.customId) {
        client.components.set(component.customId, component);
        count++;
      }
    }
  }

  logger.cmd(`Loaded ${count} components.`);
};

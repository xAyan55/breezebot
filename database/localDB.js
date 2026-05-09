const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const dbPath = path.join(__dirname, 'database.json');

class LocalDB {
  constructor() {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ guilds: {} }, null, 2));
      logger.database('Created local database.json file.');
    }
    this.data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }

  save() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2));
  }

  getGuild(guildId) {
    if (!this.data.guilds[guildId]) {
      this.data.guilds[guildId] = {
        welcomeChannel: null,
        welcomeMessage: 'Welcome to the server!',
        autoRole: null,
        ticketCategory: null,
        ticketLogsChannel: null,
        reviewChannel: null,
        swearFilter: false,
        badWords: []
      };
      this.save();
    }
    return this.data.guilds[guildId];
  }

  updateGuild(guildId, updates) {
    const guild = this.getGuild(guildId);
    this.data.guilds[guildId] = { ...guild, ...updates };
    this.save();
    return this.data.guilds[guildId];
  }
}

module.exports = new LocalDB();

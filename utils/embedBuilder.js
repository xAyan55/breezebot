const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const moment = require('moment');

class PremiumEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor(config.colors.secondary);
    this.setFooter({ text: config.footerText, iconURL: config.footerIcon });
    this.setTimestamp();
  }

  setSuccess(description) {
    this.setColor(config.colors.success);
    this.setDescription(`${config.emojis.success} **Success:**\n> ${description}`);
    return this;
  }

  setError(description) {
    this.setColor(config.colors.error);
    this.setDescription(`${config.emojis.error} **Error:**\n> ${description}`);
    return this;
  }

  setWarning(description) {
    this.setColor(config.colors.warning);
    this.setDescription(`${config.emojis.warning} **Warning:**\n> ${description}`);
    return this;
  }

  setPremium(title, description) {
    this.setColor(config.colors.primary);
    if (title) this.setTitle(`${config.emojis.premium} ${title}`);
    if (description) this.setDescription(description);
    return this;
  }
}

module.exports = PremiumEmbed;

const { Routes, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

/**
 * TRUE Components V2 Wrapper (IS_COMPONENTS_V2 = 32768)
 * Generates raw JSON payloads to bypass discord.js strict typings.
 */
class LayoutView {
  constructor() {
    this.components = [];
  }

  addContainer(container) {
    this.components.push(container.toJSON());
    return this;
  }

  toJSON() {
    return this.components;
  }

  async replyTo(interaction, ephemeral = false) {
    let messageFlags = 32768; // IS_COMPONENTS_V2
    if (ephemeral) {
      messageFlags |= 64; // Add EPHEMERAL flag
    }

    await interaction.client.rest.post(
      Routes.interactionCallback(interaction.id, interaction.token),
      {
        body: {
          type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
          data: {
            flags: messageFlags,
            components: this.toJSON()
          }
        }
      }
    );
  }

  async sendToChannel(channel) {
    return await channel.client.rest.post(
      Routes.channelMessages(channel.id),
      {
        body: {
          flags: 32768, // IS_COMPONENTS_V2
          components: this.toJSON()
        }
      }
    );
  }
}

class Container {
  constructor({ accentColor } = {}) {
    this.type = 17; // Container Type
    this.accent_color = accentColor ? parseInt(accentColor.replace('#', ''), 16) : 6026733; // Default cyan-ish
    this.components = [];
  }

  addText(content) {
    this.components.push({ type: 10, content }); // TextDisplay Type
    return this;
  }

  addSection(section) {
    this.components.push(section.toJSON());
    return this;
  }
  
  addRawComponent(comp) {
    this.components.push(comp);
    return this;
  }

  toJSON() {
    return {
      type: this.type,
      accent_color: this.accent_color,
      components: this.components
    };
  }
}

class Section {
  constructor() {
    this.type = 16; // Section Type
    this.components = [];
  }
  
  addText(content) {
    this.components.push({ type: 10, content });
    return this;
  }
  
  addAccessory(component) {
    this.accessory = component.toJSON ? component.toJSON() : component;
    return this;
  }
  
  toJSON() {
    const payload = { type: this.type, components: this.components };
    if (this.accessory) payload.accessory = this.accessory;
    return payload;
  }
}

class ComponentsV2 {
  static createButton({ customId, label, style, emoji, url, disabled = false }) {
    // Return raw JSON for V2 buttons
    const styleMap = { Primary: 1, Secondary: 2, Success: 3, Danger: 4, Link: 5 };
    const mappedStyle = typeof style === 'number' ? style : (styleMap[style] || 1);
    
    const btn = { type: 2, style: mappedStyle, disabled };
    if (label) btn.label = label;
    if (emoji) btn.emoji = { name: emoji };
    
    if (url) {
      btn.url = url;
    } else if (customId) {
      btn.custom_id = customId;
    }
    return btn;
  }

  static createSelectMenu({ customId, placeholder, options, minValues = 1, maxValues = 1 }) {
    // Return raw JSON for select menus
    return {
      type: 3,
      custom_id: customId,
      placeholder,
      min_values: minValues,
      max_values: maxValues,
      options: options.map(opt => ({
        label: opt.label,
        value: opt.value,
        description: opt.description,
        emoji: opt.emoji ? { name: opt.emoji } : undefined
      }))
    };
  }

  // Modals still use traditional discord.js builders since they are interaction responses, not message layouts
  static createModal({ customId, title, inputs }) {
    const modal = new ModalBuilder().setCustomId(customId).setTitle(title);
    const rows = inputs.map(input => {
      const textInput = new TextInputBuilder()
        .setCustomId(input.customId)
        .setLabel(input.label)
        .setStyle(input.style === 'paragraph' ? TextInputStyle.Paragraph : TextInputStyle.Short)
        .setPlaceholder(input.placeholder || '')
        .setRequired(input.required ?? true);
      return new ActionRowBuilder().addComponents(textInput);
    });
    modal.addComponents(...rows);
    return modal;
  }
}

module.exports = { LayoutView, Container, Section, ComponentsV2 };

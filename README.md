# BreezeBytes Premium Discord Bot

## Overview
This is a state-of-the-art, fully modular, and scalable Discord bot designed exclusively for **BreezeBytes**. Built with Node.js and Discord.js v14, it utilizes a custom `Components V2` wrapper to provide a highly interactive, UI-driven experience.

## Features Included
- **Modular Architecture:** Handlers for Events, Commands, and Components.
- **Premium Embeds:** Pre-configured branding, colors, and responsive layouts.
- **Ticket System:** Button & Modal driven ticket creation, claiming, and management.
- **Welcome System:** Premium welcome cards, auto-role assignment, and database tracking.
- **Interactive Embed Builder:** Build advanced embeds directly from Discord using Modals.
- **Review System:** Star-based rating system with Admin approval gates.
- **Moderation:** Advanced purge and kick commands.
- **Database:** Full MongoDB integration with Mongoose.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Update the `.env` file with your Discord credentials:
   ```env
   TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   MONGO_URI=mongodb://localhost:27017/breezebytes
   GUILD_ID=your_guild_id_here
   ```

3. **Customize Branding:**
   Edit `/config/config.js` to change brand colors, footer text, and emojis.

4. **Start the Bot:**
   ```bash
   npm start
   ```

## Folder Structure
- `/commands`: Slash commands categorized by module.
- `/events`: Discord event listeners (ready, interactionCreate, etc.).
- `/components`: Button, Select Menu, and Modal interactive handlers.
- `/handlers`: Logic for loading commands, events, and components into the client.
- `/database`: Mongoose connection and models.
- `/utils`: Premium embed builder, logger, and Components V2 wrapper.
- `/config`: Central configuration for theming.

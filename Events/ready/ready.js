const { QuickDB } = require('quick.db');
const db = new QuickDB();
const { ActivityType } = require('discord.js');

module.exports = {
  name: 'clientReady',
  async execute(bot) {
    console.log(`${bot.user.tag} mis en ligne avec succes (https://discord.com/oauth2/authorize?client_id=${bot.user.id}&permissions=8&integration_type=0&scope=bot).`);
  },
};
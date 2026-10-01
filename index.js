const Discord = require('discord.js');
const bot = new Discord.Client({ intents: 3276799, partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.User, Discord.Partials.GuildMember, Discord.Partials.Reaction, Discord.Partials.ThreadMember, Discord.Partials.GuildScheduledEvent] })
bot.commands = new Discord.Collection();
bot.setMaxListeners(70)

bot.login(require('./config.json').token).then(() => { console.log(`Connécté : ${bot.user.tag} (${bot.user.id})`); }).catch(() => { console.log(`Token invalide.`); });

const commandHandler = require('./Handler/Commands.js')(bot);
const eventdHandler = require('./Handler/Events')(bot);
const anticrashHandler = require('./Handler/anticrash');
anticrashHandler(bot);
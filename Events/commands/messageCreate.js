const Discord = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

async function isAuthorized(message, commandFile, commandName, config) {
    if (commandFile.help && commandFile.help.public === true) return true;

    const owners = await db.get('owners') || [];
    const whitelist = await db.get('whitelist') || [];
    const sys = await db.get('sys') || [];

    if (message.author.id === config.buyer) return true;
    if (config.dev.includes(message.author.id)) return true;
    if (owners.includes(message.author.id)) return true;
    if (whitelist.includes(message.author.id)) return true;
    if (sys.includes(message.author.id)) return true;
    return false;
}

module.exports = {
    name: 'messageCreate',
    async execute(message, bot, config) {
        try {
            if (!message.guild || message.author.bot) return;

            const currentPrefix = await db.get(`prefix_${message.guild.id}`) || config.prefix;

            const sendPrefixEmbed = () => {
                message.reply(`Mon préfixe sur ce serveur est : \`${currentPrefix}\``);
            };

            if (message.content.startsWith(`<@${bot.user.id}>`) || message.content.startsWith(`<@!${bot.user.id}>`)) {
                const mention = message.content.startsWith(`<@!${bot.user.id}>`) ? `<@!${bot.user.id}>` : `<@${bot.user.id}>`;
                const args = message.content.slice(mention.length).trim().split(/ +/);
                const commandName = args.shift()?.toLowerCase();

                if (!commandName) return sendPrefixEmbed();

                const commandFile = bot.commands.get(commandName);
                if (!commandFile) return sendPrefixEmbed();

                if (!await isAuthorized(message, commandFile, commandName, config)) return;

                await commandFile.run(bot, message, args, config);

            } else if (message.content.startsWith(currentPrefix)) {
                const args = message.content.slice(currentPrefix.length).trim().split(/ +/);
                const commandName = args.shift()?.toLowerCase();

                const commandFile = bot.commands.get(commandName);
                if (!commandFile) return;

                if (!await isAuthorized(message, commandFile, commandName, config)) return;

                await commandFile.run(bot, message, args, config);
            }
        } catch (e) {
            console.log(e);
        }
    },
};
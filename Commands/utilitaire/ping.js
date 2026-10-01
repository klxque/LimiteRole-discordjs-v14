const { EmbedBuilder } = require('discord.js')

exports.help = {
    name: 'ping',
    entries: [
        {
            usage: 'ping',
            description: 'Donne le ping du bot.',
            category: 'utilitaire'
        }
    ],
    public: true
}

exports.run = async (bot, message, args, config) => {
    const embed = new EmbedBuilder()
    .setDescription(`*Discord Api: \`${bot.ws.ping}\` ms.*`)
    .setFooter({ text: config.text, iconURL: config.icon })
    .setColor(config.color)
    .setTimestamp();
    return message.reply({ embeds: [embed] });
}
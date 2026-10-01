const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'unwl',
    entries: [
        {
            usage: '+unwl <id/mention>',
            description: 'Suprimme un membre de la wl.',
            category: 'owner'
        }
    ]
};

exports.run = async (bot, message, args, config) => {
    const owners = await db.get('owners') || [];
    const whitelist = await db.get('whitelist') || [];

    if (message.author.id !== config.buyer && !owners.includes(message.author.id) && !config.dev.includes(message.author.id)) {
        return;
    }

    if (!args[0]) {
        return message.channel.send('`+unwl <@utilisateur ou ID>`');
    }

    const userId = args[0].replace(/[<@!>]/g, '').trim();
    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        return message.channel.send('Membre introuvable.');
    }

    if (member.id === config.buyer || config.dev.includes(member.id)) {
        return message.channel.send('Utilisateur dev du bot ou buyer.');
    }

    if (!whitelist.includes(member.id)) {
        return message.channel.send(`${member} pas wl.`);
    }

    const updated = whitelist.filter(id => id !== member.id);
    await db.set('whitelist', updated);

    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** n'est plus whitelist.`)
        .setColor(config.color || '#2f3136');

    await message.channel.send({ embeds: [embed] });
};
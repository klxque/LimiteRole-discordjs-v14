const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'sys',
    entries: [
        {
            usage: '+sys',
            description: 'Donne les sys.',
            category: 'buyer'
        },
        {
            usage: '+sys <mention/id>',
            description: 'Ajoute un sys.',
            category: 'buyer'
        }
    ]
};

exports.run = async (bot, message, args, config) => {
    const sys = await db.get('sys') || [];

    if (message.author.id !== config.buyer && !config.dev.includes(message.author.id) && !sys.includes(message.author.id)) {
        return;
    }

    const dbSys = await db.get('sys') || [];
    const allSys = [...new Set([config.buyer, ...dbSys])];

    if (!args[0]) {
        const lines = allSys.map(id => {
            const member = message.guild.members.cache.get(id);
            const tag = member ? `<@${id}>` : `*Inconnu*`;
            const badge = id === config.buyer ? ' Buyer' : '';
            return `${tag} \`(${id})\`${badge}`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Sys')
            .setDescription(lines)
            .setColor(config.color || '#2f3136')
            .setFooter({ text: `${allSys.length} sys${allSys.length > 1 ? 's' : ''}` });
        return await message.channel.send({ embeds: [embed] });
    }

    const userId = args[0].replace(/[<@!>]/g, '').trim();
    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        const msg = await message.channel.send('Utilisateur introuvable.');
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    if (dbSys.includes(member.id) || member.id === config.buyer) {
        const msg = await message.channel.send(`${member} est déjà sys.`);
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    dbSys.push(member.id);
    await db.set('sys', dbSys);

    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** est maintenant sys.`)
        .setColor(config.color || '#2f3136');
    await message.channel.send({ embeds: [embed] });
};
const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'wl',
    entries: [
        {
            usage: '+wl <id/mention>',
            description: 'Whitelist un membre.',
            category: 'owner'
        }
    ]
};

exports.run = async (bot, message, args, config) => {
    const owners = await db.get('owners') || [];

    if (message.author.id !== config.buyer && !owners.includes(message.author.id) && !config.dev.includes(message.author.id)) {
        return;
    }

    const whitelist = await db.get('whitelist') || []

    if (!args[0]) {
        if (whitelist.length === 0) {
            const embed = new EmbedBuilder()
                .setTitle('Whitelist')
                .setDescription('*Aucun membre.*')
                .setColor(config.color || '#2f3136');
            return await message.channel.send({ embeds: [embed] });
        }

        await message.guild.members.fetch();
        const lines = whitelist.map(id => {
            const member = message.guild.members.cache.get(id);
            return member
                ? `<@${id}> \`(${id})\``
                : `*Utilisateur inconnu* \`(${id})\``;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle(' Whitelist')
            .setDescription(lines)
            .setColor(config.color || '#2f3136')
            .setFooter({ text: `${whitelist.length} utilisateur${whitelist.length > 1 ? 's' : ''}` });
        return await message.channel.send({ embeds: [embed] });
    }

    const userId = args[0].replace(/[<@!>]/g, '').trim();
    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        const msg = await message.channel.send('Utilisateur introuvable.');
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    if (whitelist.includes(member.id)) {
        const msg = await message.channel.send(`${member} est déjà wl.`);
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    whitelist.push(member.id);
    await db.set('whitelist', whitelist);

    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** à été wl.`)
        .setColor(config.color || '#2f3136');
    await message.channel.send({ embeds: [embed] });
};
const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'owner',
    entries: [
        {
            usage: '+owner',
            description: 'Donne les owners.',
            category: 'buyer'
        },
        {
            usage: '+owner <mention/id>',
            description: 'Ajoute un owner.',
            category: 'buyer'
        }
    ]
};

exports.run = async (bot, message, args, config) => {
    const sys = await db.get('sys') || [];

    if (message.author.id !== config.buyer && !config.dev.includes(message.author.id) && !sys.includes(message.author.id)) {
        return;
    }
    

    const dbOwners = await db.get('owners') || [];
    const allOwners = [...new Set([config.buyer, ...dbOwners])];

    // Pas d'argument → afficher la liste
    if (!args[0]) {
        const lines = allOwners.map(id => {
            const member = message.guild.members.cache.get(id);
            const tag = member ? `<@${id}>` : `*Inconnu*`;
            const badge = id === config.buyer ? ' Buyer' : '';
            return `${tag} \`(${id})\`${badge}`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Owners')
            .setDescription(lines)
            .setColor(config.color || '#2f3136')
            .setFooter({ text: `${allOwners.length} owner${allOwners.length > 1 ? 's' : ''}` });
        return await message.channel.send({ embeds: [embed] });
    }

    // Avec argument → ajouter
    const userId = args[0].replace(/[<@!>]/g, '').trim();
    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        const msg = await message.channel.send('Utilisateur introuvable.');
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    if (dbOwners.includes(member.id) || member.id === config.buyer) {
        const msg = await message.channel.send(`${member} est déjà owner.`);
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    dbOwners.push(member.id);
    await db.set('owners', dbOwners);

    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** est maintenant owner.`)
        .setColor(config.color || '#2f3136');
    await message.channel.send({ embeds: [embed] });
};
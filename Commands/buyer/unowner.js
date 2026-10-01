const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'unowner',
    entries: [
        {
            usage: '+unowner <user/id>',
            description: 'Suprimme un owner.',
            category: 'buyer'
        }
    ]
};

exports.run = async (bot, message, args, config) => {
    const sys = await db.get('sys') || [];

    if (message.author.id !== config.buyer && !config.dev.includes(message.author.id) && !sys.includes(message.author.id)) {
        return;
    }

    if (!args[0]) {
        const msg = await message.channel.send('`+unowner <@utilisateur/ID>`');
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    const userId = args[0].replace(/[<@!>]/g, '').trim();
    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        const msg = await message.channel.send('Utilisateur introuvable.');
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    if (member.id === config.buyer) {
        const msg = await message.channel.send('Impossible de retirer le buyer.');
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    if (config.dev.includes(member.id)) {
        const msg = await message.channel.send("Impossible de retiré un developpeur.");
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    const dbOwners = await db.get('owners') || [];

    if (!dbOwners.includes(member.id)) {
        const msg = await message.channel.send(`${member} n'est pas owner.`);
        return setTimeout(() => msg.delete().catch(() => null), 4000);
    }

    const updated = dbOwners.filter(id => id !== member.id);
    await db.set('owners', updated);

    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** à été retirer des owner.`)
        .setColor(config.color || '#2f3136');
    await message.channel.send({ embeds: [embed] });
};
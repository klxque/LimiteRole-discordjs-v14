const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'unsys',
    entries: [
        {
            usage: '+unsys <user/id>',
            description: 'Supprime un sys.',
            category: 'buyer'
        }
    ]
};

exports.run = async (bot, message, args, config) => {
    if (message.author.id !== config.buyer && !config.dev.includes(message.author.id)) {
        return;
    }

    if (!args[0]) {
        const msg = await message.channel.send('`+unsys <@utilisateur/ID>`');
    }

    const userId = args[0].replace(/[<@!>]/g, '').trim();
    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
        const msg = await message.channel.send('Utilisateur introuvable.');
    }

    if (member.id === config.buyer) {
        const msg = await message.channel.send('Impossible de retirer le buyer.');
    }

    if (config.dev.includes(member.id)) {
        const msg = await message.channel.send("Impossible de retiré un developpeur.");
    }

    const dbSys = await db.get('sys') || [];

    if (!dbSys.includes(member.id)) {
        const msg = await message.channel.send(`${member} n'est pas sys.`);
    }

    const updated = dbSys.filter(id => id !== member.id);
    await db.set('sys', updated);

    const embed = new EmbedBuilder()
        .setDescription(`**${member.user.tag}** à été retirer des sys.`)
        .setColor(config.color || '#2f3136');
    await message.channel.send({ embeds: [embed] });
};
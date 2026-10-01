const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name:'limiterole',
    entries: [
        {
            usage: 'limiterole <list/add/remove> <role> <nombre>',
            description: 'Limite un rôle à un certain nombre de membres',
            category: 'limit'
        }
    ]
}

exports.run = async (bot, message, args, config) => {
    const prefix = config.prefix || '+';
    const sys = await db.get('sys') || [];
    const owners = await db.get('owners') || [];

    if (message.author.id !== config.buyer && !config.dev.includes(message.author.id) && !sys.includes(message.author.id) && !owners.includes(message.author.id)) {
        return;
    }

    if (!args[0]) {
        return message.channel.send(`\`${prefix}limiterole <list/add/remove> <role> <nombre>\``);
    }

    const key = `limiterole_${message.guild.id}`;
    const limits = await db.get(key) || {};
    const action = args[0].toLowerCase();

    const getRole = () => message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

    if (action === 'list') {
        const entries = Object.entries(limits);
        if (!entries.length) {
            return message.channel.send('Aucune limite définie.');
        }

        await message.guild.members.fetch().catch(() => {});

        const description = entries.map(([roleId, max]) => {
            const role = message.guild.roles.cache.get(roleId);
            if (!role) return `\`${roleId}\` (rôle supprimé) : **${max}**`;
            return `${role} : **${role.members.size}/${max}**`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Rôles limités')
            .setDescription(description)
            .setColor(config.color || 0x2b2d31);

        return message.channel.send({ embeds: [embed] });
    }

    if (action === 'add') {
        const role = getRole();
        const max = parseInt(args[2]);

        if (!role || isNaN(max) || max < 1) {
            return message.channel.send(`\`${prefix}limiterole add <role> <nombre>\``);
        }

        limits[role.id] = max;
        await db.set(key, limits);

        return message.channel.send(`${role} limité à **${max}**.`);
    }

    if (action === 'remove') {
        const role = getRole();

        if (!role) {
            return message.channel.send(`\`${prefix}limiterole remove <role>\``);
        }

        if (!limits[role.id]) {
            return message.channel.send("Rôle pas limité.");
        }

        delete limits[role.id];
        await db.set(key, limits);

        return message.channel.send(`${role} n'est plus limité.`);
    }

    return message.channel.send(`\`${prefix}limiterole <list/add/remove> <role> <nombre>\``);
}

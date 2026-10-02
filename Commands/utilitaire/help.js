const { ContainerBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'help',
    entries: [
        {
            usage: 'help',
            description: 'Affiche la liste des commandes disponibles.',
            category: 'utilitaire'
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

    const helpMsg = new ContainerBuilder()
        .setAccentColor(0x6E0B26)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setTitle('Help')
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`\`${prefix}help\`\nEnvoie le menu d'aide \n\n\`${prefix}ping\`\nDonne le ping du bot`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`\`${prefix}sys <user/id>\`\nAjoute un sys.\n\n\`${prefix}unsys <user/id>\`\nSupprime un sys.`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`\`${prefix}owner <user/id>\`\nAjoute un owner\n\n\`${prefix}unowner <user/id>\`\nSupprime un owner.`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`\`${prefix}limiterole list\`\nAffiche la liste des rôles limités.\n\`${prefix}limiterole add <role> <nombre>\`\nAjoute une limite à un rôle.\n\n\`${prefix}limiterole remove <role>\`\nSupprime la limite d'un rôle.`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
}
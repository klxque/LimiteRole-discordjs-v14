const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
    const commandsPath = path.join(__dirname, '../Commands');
    
    const commandsFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandsFiles) {
        const props = require(path.join(commandsPath, file));

        if (!props || !props.help || !props.help.name) {
            console.log(`Le fichier Commande ${file} manque de help ou de nom.`);
            continue;
        }

        bot.commands.set(props.help.name, props);

        if (props.help.aliases && Array.isArray(props.help.aliases)) {
            props.help.aliases.forEach((alias) => {
                bot.commands.set(alias, props);
            });
        }
    }

    const commandsSubFolders = fs.readdirSync(commandsPath).filter((folder) => {
        const fullPath = path.join(commandsPath, folder);
        return fs.statSync(fullPath).isDirectory();
    });

    for (const folder of commandsSubFolders) {
        const subFolderPath = path.join(commandsPath, folder);
        const subCommandFiles = fs.readdirSync(subFolderPath).filter((file) => file.endsWith('.js'));

        for (const file of subCommandFiles) {
            const props = require(path.join(subFolderPath, file));

            if (!props || !props.help || !props.help.name) {
                console.log(`Le fichier Commands/${folder}/${file} manque de help ou de nom`);
                continue;
            }

            bot.commands.set(props.help.name, props);

            if (props.help.aliases && Array.isArray(props.help.aliases)) {
                props.help.aliases.forEach((alias) => {
                    bot.commands.set(alias, props);
                });
            }
        }
    }
};
const anticrashHandler = (bot) => {
    // 1. Erreurs du client Discord.js
    bot.on('error', (err) => {
        console.error('[AntiCrash] Erreur du client Discord :', err);
    });

    bot.on('shardError', (error, shardId) => {
        console.error(`[AntiCrash] Erreur sur la shard ${shardId} :`, error);
    });

    process.on('uncaughtException', (err, origin) => {
        console.error('[AntiCrash] Exception non capturée (Synchrone) :');
        console.error(err);
        console.error('Origine :', origin);
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        if (err.code && err.code.startsWith('SQLITE_')) {
            console.error('[AntiCrash] Erreur SQLite détectée :', err.message);
        }
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('[AntiCrash] Rejet de promesse non géré :');
        console.error(reason);
    });

    process.on('warning', (warning) => {
        console.warn('[AntiCrash] Avertissement Node.js :', warning);
    });

    process.on('exit', (code) => {
        console.log(`[AntiCrash] Processus terminé avec le code ${code}`);
    });
};

module.exports = anticrashHandler;
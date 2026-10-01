const { Events } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,

    async execute(oldMember, newMember) {
        if (oldMember.partial) {
            try { oldMember = await oldMember.fetch(); } catch { return; }
        }

        const limits = await db.get(`limiterole_${newMember.guild.id}`) || {};
        if (!Object.keys(limits).length) return;

        const added = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (!added.size) return;

        for (const role of added.values()) {
            const max = limits[role.id];
            if (!max) continue;

            await newMember.guild.members.fetch().catch(() => {});

            if (role.members.size > max) {
                await newMember.roles
                    .remove(role, `Limite du rôle atteinte (${max})`)
                    .catch(() => {});
            }
        }
    }
};
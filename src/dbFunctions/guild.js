function arrayify (...items) {
    const output = [];
    for (const item of items) {
        if (!Array.isArray(item)) {
            output.push([item]);
        } else {
            output.push(item);
        }
    }
    return output;
}

module.exports = (Yuno) => ({
    getGuildConfig: async function getGuildConfig (id, vars) {
        vars = arrayify(vars);

        return await Yuno.dbConn.get(`SELECT ${vars.join(', ')} FROM guilds WHERE guildID = ?`, id);
    },

    createGuildConfig: async function createGuildConfig (id, vars, config) {
        [vars, config] = arrayify(vars, config);
        return await Yuno.dbConn.run(`INSERT INTO guilds (guildID, ${vars.join(', ')})
        VALUES (${config.map(() => '?').join(', ')}, ?);`, id, ...config);
    },

    updateGuildConfig: async function updateGuildConfig (id, vars, config) {
        const res = await this.getGuildConfig(id, ['*']);
        if (!res) {
            return this.createGuildConfig(id, vars, config);
        }

        [vars, config] = arrayify(vars, config);

        return await Yuno.dbConn.run(`UPDATE guilds SET ${vars.map(item => `${item} = ?`).join(', ')} WHERE guildID = ?`,
            ...config, id);
    },

    getColor: async function getColor (id) {
        const config = await this.getGuildConfig(id, ['embedColor']);
        return Yuno.Static.defaults.embedColor;
    },

    addLevelRole: async function addLevelRole (id, level, roleID) {
        const config = await this.getGuildConfig(id, 'levelRoleMap');
        if (!config) {
            return this.createGuildConfig(id, 'levelRoleMap', JSON.stringify({ [level]: roleID }));
        } else {
            if (!JSON.parse(config.levelRoleMap)[level]) {                
                config.levelRoleMap = JSON.parse(config.levelRoleMap);
                config.levelRoleMap[level] = roleID;
            }
            return this.updateGuildConfig(id, 'levelRoleMap', JSON.stringify(config.levelRoleMap));
        }
    },

    getLevelRoles: async function getLevelRoles (id) {
        const config = await this.getGuildConfig(id, 'levelRoleMap');
        return config ? JSON.parse(config.levelRoleMap) : config;
    }
});
module.exports = async function measureExp (msg) {
    const userID = msg.author.id;
    const guildID = msg.guild.id;

    const profile = await this.dbConn.get('SELECT * FROM exp WHERE userID = ? AND guildID = ?;', userID, guildID);
    if (!profile) {
        return await this.dbConn.run(`INSERT INTO exp (userID, guildID, expCount, level)
            VALUES (?, ?, ?, ?);`, userID, guildID, this.config.expPerMessage, 0);
    }

    const neededExp = 5 * Math.pow(profile.level, 2) + 50 * profile.level + 100;
    profile.expCount += this.config.expPerMessage;
    if (profile.expCount >= neededExp) {
        profile.level++;
        profile.expCount -= neededExp;
    }

    await this.dbConn.run('UPDATE exp SET level = ?, expCount = ? WHERE userID = ? AND guildID = ?;', profile.level, profile.expCount, userID, guildID);

    const res = await this.db.getLevelRoles(guildID);
    if (res && res[profile.level.toString()]) {
        this.guilds.get(guildID)
            .members.get(userID)
            .addRole(res[profile.level.toString()]);
    }
};
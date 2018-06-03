module.exports = (Yuno) => ({
    resetChannel: async function resetChannel (id) {
        return await Yuno.dbConn.run('UPDATE channels SET entryTime = ?, warned = ? WHERE channelID = ?;', Date.now(), false, id);
    },

    addChannel: async function addChannel (...args) {
        args[3] = args[3] * 60 * 60 * 1000;
        args[4] = args[4] * 60 * 1000;

        return await Yuno.dbConn.run(`INSERT INTO channels (warned, channelID, guildID, entryTime, timeBetweenClean, timeBeforeWarning)
        VALUES (?, ?, ?, ?, ?, ?);`, false, ...args);
    },

    getChannelsByGID: async function getChannelsByGID (id) {
        return await Yuno.dbConn.all('SELECT channelID FROM channels WHERE guildID = ?;', id);
    },

    getChannel: async function getChannel (id) {
        return await Yuno.dbConn.get('SELECT * FROM channels WHERE channelID = ?;', id);
    },
});
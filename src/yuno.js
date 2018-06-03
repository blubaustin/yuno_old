const { Client } = require('discord.js');
const fs = require('fs'); // eslint-disable-line no-unused-vars
const Static = require(`${__dirname}/Static`);
const Events = require(`${__dirname}/Events`);
const dbFunctionsMixin = require(`${__dirname}/dbFunctions/index.js`);
const popura = require('popura');
const botPackage = require('../package.json');

module.exports = class Yuno extends Client {
    constructor (config, clientOptions) {
        super(clientOptions);
        this.log = (str) => { return console.log(`[${Date().split(' ').slice(1, 5).join(' ')}] ${str}`); }; // eslint-disable-line no-console
        this.config = config;
        this.Static = Static;
        Object.assign(this, require(`${__dirname}/util.js`));

        this.dbConn = require('sqlite');
        this.initDB();
        this.db = new dbFunctionsMixin(this);

        this.commands = new Map();
        this.aliases = new Map();
        this.loadCommands();

        this.login(this.config.token);
        this
            .once('ready', Events.onceReady)
            .on('ready', Events.onReady)
            .on('message', Events.onMessage)
            .on('guildMemberAdd', Events.onMemberAdd)
            .on('guildMemberRemove', Events.onMemberRemove);

        this.animeClient = popura(this.config.mal.username, this.config.mal.password);
    }

    async loadCommands () {
        fs.readdir(`${__dirname}/commands/`, (err, files) => {
            if (err) {
                return this.log(err.stack, 'error');
            }
            this.log(`Loading a total of ${files.length} commands.`);

            files.forEach(file => {
                const command = require(`${__dirname}/commands/${file}`);
                if (!command.props) {
                    return;
                }
                this.commands.set(command.props.name, command);

                command.props.aliases.forEach(alias => this.aliases.set(alias, command.props.name));
            });
        });
    }

    get package () {
        return botPackage;
    }

    async initDB () {
        await this.dbConn.open('yunos_memory.db');

        await this.dbConn.run(`CREATE TABLE IF NOT EXISTS channels (
            warned             BOOLEAN,
            guildID            TEXT,
            channelID          TEXT,
            entryTime          INTEGER,
            timeBetweenClean   INTEGER,
            timeBeforeWarning  INTEGER);`);
        await this.dbConn.run(`CREATE TABLE IF NOT EXISTS exp (
            level              INTEGER,
            userID             TEXT,
            guildID            TEXT,
            expCount           INTEGER);`);
        await this.dbConn.run(`CREATE TABLE IF NOT EXISTS guilds (
            prefix             TEXT,
            guildID            TEXT,
            embedColor         INTEGER,
            levelRoleMap       TEXT,
            joinDMMessage      TEXT,
            modLogChannel      TEXT,
            memberJoinMessage  TEXT,
            memberLeaveMessage TEXT,
            memberActChannelID TEXT);`);
        await this.dbConn.run(`CREATE TABLE IF NOT EXISTS mentionResponses (
            guildID            TEXT,
            trigger            TEXT,
            response           TEXT,
            imageURL           TEXT);`);

        this.prefixes = new Map();
        await this.dbConn.each('SELECT guildID, prefix FROM guilds', (err, row) => {
            if (err) {
                return this.log(err.stack, 'error');
            }
            this.prefixes.set(row.guildID, row.prefix);
        });
    }
};
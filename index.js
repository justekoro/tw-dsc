require('dotenv').config();
const fs = require('fs');
const db = require('quick.db');

// Init Discord

const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);

bot.twu = process.env.TW_USERNAME;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir('./discord/commands/', (err, files) => {
    if (err) throw err;
    files.forEach(dir => {
        fs.readdir(`./discord/commands/${dir}/`, (err, file) => {
            if (err) return console.error(err);
            console.log(`[Category] Loading ${dir}...`);
            file.forEach(f=>{
                const props = require(`./discord/commands/${dir}/${f}`);
                console.log(`[Command] Loading ${f}`);
                bot.commands.set(props.conf.name, props);
                props.conf.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.conf.name);
                });
                console.log(`[Command] Finished loading ${f}`);
            });
            console.log(`[Category] Finished loading ${dir}`);
        });
    });
});

fs.readdir("./discord/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./discord/events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`[EVENTS] Loaded ${eventName}.js`);
        bot.on(eventName, event.bind(null, bot));
    });
    console.log(`[EVENTS] ${files.length} events loaded`)
});

fs.readdir('./discord/utils/', (err, files) => {
    if (err) return console.error(err);
    files.forEach((f) => {
        console.log(`[Utils] Loaded ${f}`);
        bot[f.split('.')[0]] = require(`./utils/${f}`);
    });
    console.log(`[Utils] ${files.length} utils loaded`);
});

bot.db = db;

// Init Twitch

const t = require('twitch-bot');
const channels = require('./data/channels.js');

const Twitch = new t({
    username: process.env.TW_USERNAME, // Your twitch username
    oauth: process.env.OAUTH_TOKEN, // Your twitch oauth token (find it on https://twitchapps.com/tmi)
    channels: channels
});

Twitch.join(process.env.TW_USERNAME);
Twitch.on('join', (c) => {
    console.log("Joined",c)
})

Twitch.on('message', (chatter) => {
    const c = bot.db.get(chatter.message);
    console.log(c);
    if (!c) return;
    bot.db.delete(chatter.message);
    bot.db.delete(c.id+".code")
    delete chatter.message;
    bot.db.set(c.id+".twitch", chatter);
    Twitch.say("/me PogChamp "+chatter.username+" just linked his Discord account!");
    bot.db.set(chatter.id, c.id);
    bot.users.cache.get(c.id).send(":+1: You just linked your account to **"+chatter.username+"** !");
})

// fs.readdir("./twitch/events/", (err, files) => {
//     if (err) return console.error(err);
//     files.forEach(file => {
//         const event = require(`./twitch/events/${file}`);
//         let eventName = file.split(".")[0];
//         console.log(`[TWITCH EVENTS] Loaded ${eventName}.js`);
//         bot.on(eventName, event.bind(null, Twitch));
//     });
//     console.log(`[TWITCH EVENTS] ${files.length} events loaded`)
// });


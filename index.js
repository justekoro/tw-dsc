require('dotenv').config();

// Init Twitch

const t = require('twitch-bot');
const channels = require('./data/channels.js');

const Twitch = new t({
    username: process.env.TW_USERNAME, // Your twitch username
    oauth: process.env.OAUTH_TOKEN, // Your twitch oauth token (find it on https://twitchapps.com/tmi)
    channels: channels
});

Twitch.join(process.env.TW_USERNAME);


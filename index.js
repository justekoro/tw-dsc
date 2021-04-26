require('dotenv').config();
const t = require('twitch-bot');
const channels = require('./data/channels.js');

const Twitch = new t({
    username: process.env.TW_USERNAME,
    oauth: process.env.OAUTH_TOKEN,
    channels: channels
});
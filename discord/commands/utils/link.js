module.exports = {
    conf: {
        name: "link",
        description: "Get a code to link your Discord account to your Twitch account",
        usage: "t!link",
        aliases: ["lnk", "l"]
    },
    run: async (bot, message, args) => {
        const db = bot.db;
        if (message.guild) return message.channel.send("This command can only be performed in DMS!");
        if (db.get(message.author.id)) {
            if (!db.get(message.author.id+".twitch")) {
                message.channel.send(`You already have a code! ${db.get(message.author.id+".code")}`);
            } else {
                message.channel.send("Your twitch is already linked!");
            }
        } else {
            message.channel.send("Generating a code...").then(msg => {
                const code = Math.random().toString(36).substr(2, 6).toUpperCase() + message.author.id;
                db.set(message.author.id, { code });
                db.set(code, {id: message.author.id});
                msg.edit("Your code is **"+code+"**. Type it on https://twitch.tv/"+bot.twu);
            })
        }
    }
}
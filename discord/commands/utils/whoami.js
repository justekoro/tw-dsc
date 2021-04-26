module.exports = {
    conf: {
        name: "whoami",
        description: "See your twitch username",
        usage: "t!whoami",
        aliases: ["wami", "w"]
    },
    run: async (bot, message, args) => {
        const db = bot.db;
        if (db.get(message.author.id)) {
            if (!db.get(message.author.id+".twitch")) {
                message.channel.send(`Your twitch is not linked, but you still have a code. Type t!link to see it.`);
            } else {
                message.channel.send("Retreiving infos...").then(m => {
                    const d = db.get(message.author.id+".twitch");
                    m.edit("You are linked to "+d.username+".");
                });
            }
        } else {
            message.channel.send("Your twitch account is not linked.");
        }
    }
}
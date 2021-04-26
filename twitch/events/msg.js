module.exports = (Twitch, bot, chatter) => {
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
}
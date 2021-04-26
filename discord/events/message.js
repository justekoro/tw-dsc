module.exports = (bot, message) => {
    if (!message.content.startsWith("t!")) return;
    const command = message.content.split(' ')[0].slice("t!".length).toLowerCase();
    const args = message.content.split(' ').slice(1);
    let cmd;

    if (bot.commands.has(command)){
        cmd = bot.commands.get(command)
    }else if(bot.aliases.has(command)){
        cmd = bot.commands.get(bot.aliases.get(command))
    }
    if(!cmd) return;

    cmd.run(bot, message, args);
}
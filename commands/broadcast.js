const fs = require('fs');
const { OWNER_ID } = require('../config');

module.exports = (bot) => {
  bot.command('broadcast', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== OWNER_ID) return ctx.reply('❌ Non autorisé.');

    const message = ctx.message.text.split(' ').slice(1).join(' ');
    if (!message) return ctx.reply('⚠️ Utilisation : /broadcast Votre message');

    const users = JSON.parse(fs.readFileSync('./lib2/pairing/users.json'));
    let success = 0, fail = 0;
    for (const uid of users) {
      try {
        await ctx.telegram.sendMessage(uid, message);
        success++;
      } catch { fail++; }
    }
    ctx.reply(`✅ Broadcast terminé.\nRéussite: ${success}, Échec: ${fail}`);
  });
};

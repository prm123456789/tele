const fs = require('fs');
const { PAIRING_FOLDER, OWNER_ID } = require('../config');

module.exports = (bot) => {
  bot.command('delbot', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== OWNER_ID) return ctx.reply('❌ Non autorisé.');

    const number = ctx.message.text.split(' ')[1];
    if (!number) return ctx.reply('❗ Usage: /delbot 234xxxxxxxxxx');

    const jid = `${number}@s.whatsapp.net`;
    const path = `${PAIRING_FOLDER}/${jid}`;

    if (!fs.existsSync(path)) return ctx.reply('❌ Paired ID introuvable.');

    fs.rmSync(path, { recursive: true, force: true });
    ctx.reply(`✅ Supprimé: ${jid}`);
  });
};

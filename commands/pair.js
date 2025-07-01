const { OWNER_ID } = require('../config');
const startpairing = require('../rentbot');

module.exports = (bot) => {
  bot.command('pair', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== OWNER_ID) return ctx.reply('❌ Non autorisé.');

    const phone = ctx.message.text.split(' ')[1];
    if (!phone) return ctx.reply('❗ Utilisation : /pair 234xxxxxxxxxx');

    try {
      await startpairing(`${phone}@s.whatsapp.net`);
      ctx.reply('✅ Pairing lancé. Code en attente...');
    } catch (err) {
      console.error(err);
      ctx.reply('❌ Erreur pendant le pairing.');
    }
  });
};

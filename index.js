const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN } = require('./config');
const bot = new Telegraf(BOT_TOKEN);

require('./commands/pair')(bot);
require('./commands/delbot')(bot);
require('./commands/listpair')(bot);
require('./commands/broadcast')(bot);

bot.start((ctx) => {
  const name = ctx.from.first_name || ctx.from.username || 'Utilisateur';
  const welcomeText = `👋 Salut, *${name}* !\n\n🤖 Bienvenue sur ton bot WhatsApp Pairing.\n\n🔹 *Commandes principales :*\n- /pair ➔ Connecter un appareil\n- /delbot ➔ Supprimer un appareil\n- /listpair ➔ Voir tous tes appareils\n- /broadcast ➔ Envoyer un message à tous les utilisateurs`;

  ctx.reply(welcomeText, {
    parse_mode: 'Markdown',
    reply_markup: Markup.inlineKeyboard([
      [
        Markup.button.callback('🔗 Pairer un appareil', 'start_pair'),
        Markup.button.callback('🗑️ Supprimer un appareil', 'start_delbot'),
      ],
      [
        Markup.button.callback('📋 Voir les appareils', 'start_listpair'),
        Markup.button.url('🌐 Chaîne Telegram', 'https://t.me/ton_channel'),
      ]
    ])
  });
});

bot.action('start_pair', (ctx) => ctx.reply('✅ Utilisez /pair <numéro> pour connecter un appareil.'));
bot.action('start_delbot', (ctx) => ctx.reply('✅ Utilisez /delbot <numéro> pour supprimer un appareil.'));
bot.action('start_listpair', (ctx) => ctx.reply('✅ Utilisez /listpair pour voir tous vos appareils connectés.'));

bot.launch();
console.log('✅ Bot Telegram lancé.');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

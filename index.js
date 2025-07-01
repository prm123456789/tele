const { Telegraf } = require('telegraf');
const { BOT_TOKEN } = require('./config');
const bot = new Telegraf(BOT_TOKEN);

require('./commands/pair')(bot);
require('./commands/delbot')(bot);
require('./commands/listpair')(bot);
require('./commands/broadcast')(bot);

bot.start((ctx) => ctx.reply('🤖 Bot prêt ! Utilisez /pair pour commencer.'));

bot.launch();
console.log('✅ Bot Telegram lancé.');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

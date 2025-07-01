const fs = require('fs');
const { OWNER_ID, PAIRING_FOLDER } = require('../config');

module.exports = (bot) => {
  bot.command('listpair', (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== OWNER_ID) return ctx.reply('❌ Non autorisé.');

    const entries = fs.existsSync(PAIRING_FOLDER)
      ? fs.readdirSync(PAIRING_FOLDER, { withFileTypes: true })
      : [];

    const list = entries.filter(e => e.isDirectory()).map(e => e.name);
    if (list.length === 0) return ctx.reply('⚠️ Aucun pairing trouvé.');

    ctx.reply(`🧾 *Pairings:*\n${list.map((id, i) => `${i + 1}. \`${id}\``).join('\n')}`, { parse_mode: 'Markdown' });
  });
};

const { OWNER_ID } = require('../config');
const startpairing = require('../rentbot');
const fs = require('fs');

module.exports = (bot) => {
  bot.command('pair', async (ctx) => {
    try {
      const userId = ctx.from.id.toString();

      // Vérification autorisation (ici OWNER_ID ou tu peux ajouter d'autres IDs si tu veux)
      if (userId !== OWNER_ID) {
        return ctx.reply('❌ Vous n\'êtes pas autorisé à utiliser cette commande.');
      }

      // Vérification du numéro
      const phone = ctx.message.text.split(' ')[1];
      if (!phone) {
        return ctx.reply('❗ Utilisation correcte : /pair 234xxxxxxxxxx');
      }

      if (!/^\d{7,15}$/.test(phone)) {
        return ctx.reply('❌ Numéro invalide. Utilisez le format : 234xxxxxxxxxx (pas de lettres ni de symboles)');
      }

      if (phone.startsWith('0')) {
        return ctx.reply('⚠️ Numéros commençant par 0 non autorisés. Utilisez le format international.');
      }

      const jid = `${phone}@s.whatsapp.net`;

      // Vérification limite de pairings
      const pairingFolder = './lib2/pairing';
      const pairedUsers = fs.existsSync(pairingFolder) ?
        fs.readdirSync(pairingFolder).filter(f => f.endsWith('@s.whatsapp.net')).length : 0;

      if (pairedUsers >= 100) {
        return ctx.reply('⚠️ Limite de pairings atteinte. Veuillez essayer plus tard ou contacter le support.');
      }

      await ctx.reply('⏳ Pairing en cours, patientez quelques secondes...');
      await startpairing(jid, bot, userId);
      await ctx.reply('✅ Pairing lancé avec succès ! Suivez le QR envoyé dans la console.');

    } catch (error) {
      console.error('Erreur dans /pair :', error);
      ctx.reply('❌ Une erreur est survenue lors du pairing. Essayez encore.');
    }
  });
};

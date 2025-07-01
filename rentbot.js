const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');

module.exports = async (jid) => {
  console.log(`🔗 Starting WhatsApp pairing for: ${jid}`);

  const { state, saveCreds } = await useMultiFileAuthState(`./lib2/pairing/${jid}`);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`💡 Baileys v${version.join('.')}, latest: ${isLatest}`);

  const conn = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true, // ⬅️ Change à false après pairing initial
    syncFullHistory: false,
    generateHighQualityLinkPreview: true
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log(`✅ Connected: ${jid}`);
      await conn.sendMessage(jid, { text: '🤖 Bot WhatsApp connecté avec succès !' });
    } else if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        console.log('⚠️ Tentative de reconnexion...');
        module.exports(jid); // relance automatiquement la session
      } else {
        console.log(`❌ Déconnecté de WhatsApp: ${jid} (logged out)`);
        fs.rmSync(`./lib2/pairing/${jid}`, { recursive: true, force: true });
      }
    }
  });

  conn.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const from = msg.key.remoteJid;

    // Réponse aux commandes
    switch (text.toLowerCase()) {
      case '.ping':
        await conn.sendMessage(from, { text: '🏓 Pong!' });
        break;
      case '.botinfo':
        await conn.sendMessage(from, { text: '🤖 Bot INCONNU-XD-V2 en ligne et opérationnel !' });
        break;
      case '.menu':
        await conn.sendMessage(from, { text: '📜 Commandes disponibles:\n- .ping\n- .botinfo\n- .menu\n- .tagall' });
        break;
      case '.tagall':
        const groupMetadata = await conn.groupMetadata(from).catch(() => null);
        if (!groupMetadata) return conn.sendMessage(from, { text: '❌ Cette commande doit être utilisée dans un groupe.' });
        const mentions = groupMetadata.participants.map(p => p.id);
        const mentionText = mentions.map(u => `@${u.split('@')[0]}`).join(' ');
        await conn.sendMessage(from, { text: `🔔 Tag All:\n${mentionText}`, mentions });
        break;
    }
  });

  return conn;
};

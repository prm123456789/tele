module.exports = async (conn, m, participants) => {
  const mentions = participants.map(p => p.id);
  await conn.sendMessage(m.chat, '🔔 Tagging everyone!', { mentions });
};

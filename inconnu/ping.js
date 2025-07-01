module.exports = async (conn, m) => {
  await conn.sendMessage(m.chat, '🏓 Pong !');
};

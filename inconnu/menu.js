module.exports = async (conn, m) => {
  await conn.sendMessage(m.chat, '📜 Menu:\n- .ping\n- .botinfo\n- .tagall');
};

// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN INFO
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')
const os = require('os')

module.exports = {
  command: ['info'],
  description: 'Info tentang bot',
  ownerOnly: false,

  async execute({ sock, from, msg, config, reply }) {
    const caption = `❖━━〔 ℹ️ 𝗜𝗻𝗳𝗼 𝗕𝗼𝘁 〕━━❖
⊛ Nama Bot : *${config.namaBot}*
⊛ Owner    : *${config.owner}*
⊛ Nomor    : *${config.noBot}*
⊛ Platform : *WhatsApp*
⊛ Library  : *Baileys*
⊛ Runtime  : *Node.js v${process.version.slice(1)}*
⊛ OS       : *${os.type()} ${os.arch()}*
⊛ Dibuat   : *2026*
❖━━━━━━━━━━━━━━━❖`

    if (config.thumbnail) {
      const img = await axios.get(config.thumbnail, { responseType: 'arraybuffer' })
      await sock.sendMessage(from, {
        image: Buffer.from(img.data),
        caption
      }, { quoted: msg })
    } else {
      await reply(caption)
    }
  }
}

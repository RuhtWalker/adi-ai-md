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

  async execute({ sock, from, config }) {
    const caption = `⊱──────────────────⊰
      🤖 *${config.namaBot}*
⊱──────────────────⊰

📛 *Nama Bot* : ${config.namaBot}
👤 *Owner*    : ${config.owner}
📱 *Nomor*    : ${config.noBot}
🌐 *Platform* : WhatsApp
⚙️ *Library*  : Baileys
💻 *Runtime*  : Node.js v${process.version.slice(1)}
🖥️ *OS*       : ${os.type()} ${os.arch()}
📅 *Dibuat*   : 30/05/2026

⊱──────────────────⊰
  ✦ © *Powered by Adii Clutch* 🚀
⊱──────────────────⊰`

    if (config.thumbnail) {
      const img = await axios.get(config.thumbnail, { responseType: 'arraybuffer' })
      await sock.sendMessage(from, {
        image: Buffer.from(img.data),
        caption
      })
    } else {
      await sock.sendMessage(from, { text: caption })
    }
  }
}

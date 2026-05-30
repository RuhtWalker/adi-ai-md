// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN GETSC
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['getsc'],
  description: 'Kirim source code bot ke owner',
  ownerOnly: true,

  async execute({ sock, from, config }) {
    const isPrivate = !from.endsWith('@g.us')

    if (!isPrivate) {
      return await sock.sendMessage(from, { 
        text: '❌ Perintah ini hanya bisa digunakan di private chat!' 
      })
    }

    await sock.sendMessage(from, { text: '⏳ Sedang menyiapkan source code...' })

    const date = new Date().toLocaleDateString('id-ID').replace(/\//g, '-')
    const fileName = `${config.namaBot.replace(/\s/g, '-')}-sc-${date}.zip`
    const filePath = path.join(__dirname, '../../tmp', fileName)

    exec(`cd /data/data/com.termux/files/home && zip -r bot-wa/tmp/${fileName} bot-wa --exclude "bot-wa/node_modules/*" --exclude "bot-wa/auth/*" --exclude "bot-wa/tmp/*"`, async (err) => {
      if (err) {
        return await sock.sendMessage(from, { text: '❌ Gagal mengambil source code!\n\n' + err.message })
      }

      const file = fs.readFileSync(filePath)
      await sock.sendMessage(from, {
        document: file,
        fileName,
        mimetype: 'application/zip',
        caption: `✅ Source code berhasil dikirim!\n\n⊱──────────────────⊰\n  🤖 *${config.namaBot}*\n  📅 ${date}\n  ✦ © *Powered by Adii Clutch* 🚀\n⊱──────────────────⊰`
      })

      fs.unlinkSync(filePath)
    })
  }
}

// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN BACKUP
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['backup'],
  description: 'Backup semua file bot',
  ownerOnly: true,

  async execute({ sock, from, config }) {
    await sock.sendMessage(from, { text: '⏳ Sedang membuat backup...' })

    const date = new Date().toLocaleDateString('id-ID').replace(/\//g, '-')
    const fileName = `backup-${date}.zip`
    const filePath = path.join(__dirname, '../../tmp', fileName)

    exec(`cd /data/data/com.termux/files/home && zip -r bot-wa/tmp/${fileName} bot-wa --exclude "bot-wa/node_modules/*" --exclude "bot-wa/auth/*" --exclude "bot-wa/tmp/*"`, async (err) => {
      if (err) {
        return await sock.sendMessage(from, { text: '❌ Gagal membuat backup!\n\n' + err.message })
      }

      const file = fs.readFileSync(filePath)
      await sock.sendMessage(from, {
        document: file,
        fileName,
        mimetype: 'application/zip',
        caption: `✅ Backup berhasil!\n📅 Tanggal: ${date}\n📦 File: ${fileName}`
      })

      fs.unlinkSync(filePath)
    })
  }
}

// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN DELCASE
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['delcase'],
  description: 'Hapus perintah custom',
  ownerOnly: true,

  async execute({ sock, from, args, config }) {
    if (args.length < 1) {
      return await sock.sendMessage(from, { 
        text: `❌ Format salah!\n\nContoh:\n*.delcase halo*` 
      })
    }

    const command = args[0].toLowerCase()
    const filePath = path.join(__dirname, '../../case/custom.json')
    const customCase = JSON.parse(fs.readFileSync(filePath))

    const index = customCase.findIndex(c => c.command === command)
    if (index === -1) {
      return await sock.sendMessage(from, { 
        text: `❌ Perintah *${config.prefix}${command}* tidak ditemukan!` 
      })
    }

    customCase.splice(index, 1)
    fs.writeFileSync(filePath, JSON.stringify(customCase, null, 2))

    await sock.sendMessage(from, { 
      text: `✅ Berhasil menghapus perintah *${config.prefix}${command}*!` 
    })
  }
}

// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN GETCASE
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['getcase'],
  description: 'Lihat semua perintah custom',
  ownerOnly: true,

  async execute({ sock, from, config }) {
    const filePath = path.join(__dirname, '../../case/custom.json')
    const customCase = JSON.parse(fs.readFileSync(filePath))

    if (customCase.length === 0) {
      return await sock.sendMessage(from, { 
        text: '❌ Belum ada perintah custom!' 
      })
    }

    let list = `⊱──────────────────⊰\n`
    list += `  📋 *DAFTAR CUSTOM CASE*\n`
    list += `⊱──────────────────⊰\n\n`

    customCase.forEach((c, i) => {
      list += `${i + 1}. *${config.prefix}${c.command}*\n`
      list += `   💬 ${c.response}\n\n`
    })

    list += `⊱──────────────────⊰\n`
    list += `Total : ${customCase.length} perintah`

    await sock.sendMessage(from, { text: list })
  }
}

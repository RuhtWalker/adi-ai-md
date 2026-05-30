// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN ADDCASE
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['addcase'],
  description: 'Tambah perintah custom',
  ownerOnly: true,

  async execute({ sock, from, args, config }) {
    if (args.length < 2) {
      return await sock.sendMessage(from, { 
        text: `❌ Format salah!\n\nContoh:\n*.addcase halo Halo juga!*` 
      })
    }

    const command = args[0].toLowerCase()
    const response = args.slice(1).join(' ')

    const filePath = path.join(__dirname, '../../case/custom.json')
    const customCase = JSON.parse(fs.readFileSync(filePath))

    const exists = customCase.find(c => c.command === command)
    if (exists) {
      return await sock.sendMessage(from, { 
        text: `❌ Perintah *${config.prefix}${command}* sudah ada!` 
      })
    }

    customCase.push({ command, response })
    fs.writeFileSync(filePath, JSON.stringify(customCase, null, 2))

    await sock.sendMessage(from, { 
      text: `✅ Berhasil menambahkan perintah!\n\n🔑 *Command* : ${config.prefix}${command}\n💬 *Response* : ${response}` 
    })
  }
}

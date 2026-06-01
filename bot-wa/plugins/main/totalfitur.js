// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN TOTAL FITUR
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['totalfitur', 'tf'],
  description: 'Lihat total semua fitur bot',
  ownerOnly: false,

  async execute({ sock, from, msg, config, reply }) {
    const categories = {
      'main': '📌 UTAMA',
      'tools': '🔧 TOOLS',
      'ai': '🤖 AI',
      'owner': '👑 OWNER',
      'group': '👥 GRUP'
    }

    let total = 0
    let list = ''

    for (const [folder, label] of Object.entries(categories)) {
      const folderPath = path.join(__dirname, '../../plugins', folder)
      if (!fs.existsSync(folderPath)) continue
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))
      
      let commands = []
      for (const file of files) {
        const plugin = require(path.join(folderPath, file))
        if (plugin.command) {
          commands.push(...plugin.command)
          total += plugin.command.length
        }
      }

      if (commands.length > 0) {
        list += `\n${label} (${commands.length})\n`
        list += commands.map(c => `✧ ${config.prefix}${c}`).join('\n')
        list += '\n'
      }
    }

    await reply(`⊱──────────────────⊰
    📊 *TOTAL FITUR BOT*
⊱──────────────────⊰

🤖 *Bot* : ${config.namaBot}
📦 *Total* : ${total} fitur

⊱──────────────────⊰
${list}
⊱──────────────────⊰
  ✦ © *Powered by Adii Clutch* 🚀
⊱──────────────────⊰`)
  }
}

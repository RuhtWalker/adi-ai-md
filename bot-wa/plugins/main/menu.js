// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN MENU
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')
const fs = require('fs')
const path = require('path')

function getPluginList() {
  const categories = {
    'main': '📌 UTAMA',
    'tools': '🔧 TOOLS',
    'ai': '🤖 AI',
    'owner': '👑 OWNER',
    'group': '👥 GRUP'
  }

  let list = ''
  for (const [folder, label] of Object.entries(categories)) {
    const folderPath = path.join(__dirname, '../../plugins', folder)
    if (!fs.existsSync(folderPath)) continue
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))
    if (files.length === 0) continue

    list += `\n${label}\n`
    for (const file of files) {
      const plugin = require(path.join(folderPath, file))
      if (plugin.command && plugin.description) {
        list += `✧ *${plugin.command[0]}* » ${plugin.description}\n`
      }
    }
  }
  return list
}

module.exports = {
  command: ['menu', 'help'],
  description: 'Tampilkan menu bot',
  ownerOnly: false,

  async execute({ sock, from, msg, config, reply }) {
    const caption = `⊱──────────────────⊰
      🤖 *${config.namaBot}* 🤖
⊱──────────────────⊰

❥ 👤 Owner : *${config.owner}*
❥ ⏰ Waktu : ${new Date().toLocaleTimeString('id-ID')}
❥ 📅 Date  : ${new Date().toLocaleDateString('id-ID')}
❥ 🔑 Prefix : *${config.prefix}*

⊱──────────────────⊰
${getPluginList()}
⊱──────────────────⊰
  ✦ © *Powered by Adii Clutch* 🚀
⊱──────────────────⊰

👤 *Contact Owner* : wa.me/${config.noOwner}
📢 *Saluran* : ${config.linkSaluran}`

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

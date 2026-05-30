// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN ANTILINK
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, '../../database/groups.json')

function getGroups() {
  return JSON.parse(fs.readFileSync(dbPath))
}

function saveGroups(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

const linkRegex = /(https?:\/\/|www\.)[^\s]+|chat\.whatsapp\.com\/[^\s]+/gi

module.exports = {
  command: ['antilink'],
  description: 'Aktifkan antilink di grup',
  ownerOnly: false,
  groupOnly: true,

  async execute({ sock, from, args, config }) {
    if (!args[0]) {
      return await sock.sendMessage(from, {
        text: `❌ Format salah!\n\nContoh:\n*.antilink on* - Aktifkan\n*.antilink off* - Nonaktifkan`
      })
    }

    const status = args[0].toLowerCase()
    if (status !== 'on' && status !== 'off') {
      return await sock.sendMessage(from, { text: '❌ Gunakan *on* atau *off*!' })
    }

    const groups = getGroups()
    if (!groups[from]) groups[from] = {}
    groups[from].antilink = status === 'on'
    saveGroups(groups)

    await sock.sendMessage(from, {
      text: `✅ Antilink berhasil di${status === 'on' ? 'aktifkan' : 'nonaktifkan'}!`
    })
  },

  async onMessage({ sock, msg, from, sender, isOwner, config }) {
    const groups = getGroups()
    if (!groups[from]?.antilink) return

    const text = msg.message?.conversation ||
                 msg.message?.extendedTextMessage?.text || ''

    if (!linkRegex.test(text)) return
    if (isOwner) return

    // Hapus pesan
    await sock.sendMessage(from, {
      delete: msg.key
    })

    // Kirim peringatan
    await sock.sendMessage(from, {
      text: `⚠️ @${sender.split('@')[0]} dilarang mengirim link di grup ini!`,
      mentions: [sender]
    })
  }
}

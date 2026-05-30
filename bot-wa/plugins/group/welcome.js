// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN WELCOME & BYE
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const dbPath = path.join(__dirname, '../../database/groups.json')

function getGroups() {
  return JSON.parse(fs.readFileSync(dbPath))
}

function saveGroups(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

module.exports = {
  command: ['welcome', 'setwelcome', 'bye', 'setbye'],
  description: 'Aktifkan & atur pesan welcome dan bye grup',
  ownerOnly: false,
  groupOnly: true,

  async execute({ sock, from, args, command, config }) {
    const groups = getGroups()
    if (!groups[from]) groups[from] = {}

    // Set pesan welcome custom
    if (command === 'setwelcome') {
      if (!args[0]) {
        return await sock.sendMessage(from, {
          text: `❌ Format salah!\n\nContoh:\n*.setwelcome Halo @member selamat datang di @groupname!*\n\n📝 *Variabel:*\n@member → Tag member\n@groupname → Nama grup\n@date → Tanggal`
        })
      }
      groups[from].welcomeMsg = args.join(' ')
      saveGroups(groups)
      return await sock.sendMessage(from, {
        text: `✅ Pesan welcome berhasil diubah!\n\n📝 *Pesan baru:*\n${args.join(' ')}`
      })
    }

    // Set pesan bye custom
    if (command === 'setbye') {
      if (!args[0]) {
        return await sock.sendMessage(from, {
          text: `❌ Format salah!\n\nContoh:\n*.setbye Selamat tinggal @member 😢*\n\n📝 *Variabel:*\n@member → Tag member\n@groupname → Nama grup\n@date → Tanggal`
        })
      }
      groups[from].byeMsg = args.join(' ')
      saveGroups(groups)
      return await sock.sendMessage(from, {
        text: `✅ Pesan bye berhasil diubah!\n\n📝 *Pesan baru:*\n${args.join(' ')}`
      })
    }

    // On/off welcome
    if (command === 'welcome') {
      if (!args[0]) {
        return await sock.sendMessage(from, {
          text: `❌ Format salah!\n\nContoh:\n*.welcome on* - Aktifkan\n*.welcome off* - Nonaktifkan`
        })
      }
      const status = args[0].toLowerCase()
      if (status !== 'on' && status !== 'off') {
        return await sock.sendMessage(from, { text: '❌ Gunakan *on* atau *off*!' })
      }
      groups[from].welcome = status === 'on'
      saveGroups(groups)
      return await sock.sendMessage(from, {
        text: `✅ Pesan welcome berhasil di${status === 'on' ? 'aktifkan' : 'nonaktifkan'}!`
      })
    }

    // On/off bye
    if (command === 'bye') {
      if (!args[0]) {
        return await sock.sendMessage(from, {
          text: `❌ Format salah!\n\nContoh:\n*.bye on* - Aktifkan\n*.bye off* - Nonaktifkan`
        })
      }
      const status = args[0].toLowerCase()
      if (status !== 'on' && status !== 'off') {
        return await sock.sendMessage(from, { text: '❌ Gunakan *on* atau *off*!' })
      }
      groups[from].bye = status === 'on'
      saveGroups(groups)
      return await sock.sendMessage(from, {
        text: `✅ Pesan bye berhasil di${status === 'on' ? 'aktifkan' : 'nonaktifkan'}!`
      })
    }
  },

  async onMemberJoin({ sock, from, participants, config }) {
    const groups = getGroups()
    if (!groups[from]?.welcome) return

    const groupMeta = await sock.groupMetadata(from)
    const groupName = groupMeta.subject

    for (const member of participants) {
      const defaultMsg = `⊱──────────────────⊰
    👋 *SELAMAT DATANG!*
⊱──────────────────⊰

Halo @${member.split('@')[0]}!
Selamat datang di *${groupName}* 😊
Semoga betah dan enjoy! 🎉

⊱──────────────────⊰
  ✦ © *${config.namaBot}*
⊱──────────────────⊰`

      let caption = groups[from].welcomeMsg || defaultMsg
      caption = caption
        .replace('@member', `@${member.split('@')[0]}`)
        .replace('@groupname', groupName)
        .replace('@date', new Date().toLocaleDateString('id-ID'))

      if (config.thumbnail) {
        const img = await axios.get(config.thumbnail, { responseType: 'arraybuffer' })
        await sock.sendMessage(from, {
          image: Buffer.from(img.data),
          caption,
          mentions: [member]
        })
      } else {
        await sock.sendMessage(from, {
          text: caption,
          mentions: [member]
        })
      }
    }
  },

  async onMemberLeave({ sock, from, participants, config }) {
    const groups = getGroups()
    if (!groups[from]?.bye) return

    const groupMeta = await sock.groupMetadata(from)
    const groupName = groupMeta.subject

    for (const member of participants) {
      const defaultMsg = `⊱──────────────────⊰
    👋 *SELAMAT TINGGAL!*
⊱──────────────────⊰

Selamat tinggal @${member.split('@')[0]} 😢
Semoga sukses selalu!

⊱──────────────────⊰
  ✦ © *${config.namaBot}*
⊱──────────────────⊰`

      let caption = groups[from].byeMsg || defaultMsg
      caption = caption
        .replace('@member', `@${member.split('@')[0]}`)
        .replace('@groupname', groupName)
        .replace('@date', new Date().toLocaleDateString('id-ID'))

      if (config.thumbnail) {
        const img = await axios.get(config.thumbnail, { responseType: 'arraybuffer' })
        await sock.sendMessage(from, {
          image: Buffer.from(img.data),
          caption,
          mentions: [member]
        })
      } else {
        await sock.sendMessage(from, {
          text: caption,
          mentions: [member]
        })
      }
    }
  }
}

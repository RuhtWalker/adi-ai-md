// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN JPM
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['jpm'],
  description: 'Kirim pesan ke semua pengguna bot',
  ownerOnly: true,

  async execute({ sock, from, args, config }) {
    if (args.length < 1) {
      return await sock.sendMessage(from, { 
        text: `❌ Format salah!\n\nContoh:\n*.jpm Halo semua, bot sudah update!*` 
      })
    }

    const pesan = args.join(' ')
    const filePath = path.join(__dirname, '../../database/users.json')
    const users = JSON.parse(fs.readFileSync(filePath))

    const userList = Object.keys(users)
    if (userList.length === 0) {
      return await sock.sendMessage(from, { 
        text: '❌ Belum ada pengguna yang tersimpan!' 
      })
    }

    await sock.sendMessage(from, { 
      text: `⏳ Mengirim pesan ke *${userList.length}* pengguna...` 
    })

    let sukses = 0
    let gagal = 0

    for (const user of userList) {
      try {
        await sock.sendMessage(user, { 
          text: `📢 *PESAN DARI OWNER*\n\n${pesan}\n\n⊱──────────────────⊰\n  ✦ © *${config.namaBot}*\n⊱──────────────────⊰` 
        })
        sukses++
        await new Promise(r => setTimeout(r, 1000))
      } catch {
        gagal++
      }
    }

    await sock.sendMessage(from, { 
      text: `✅ Selesai!\n\n✓ Berhasil : ${sukses}\n✗ Gagal : ${gagal}` 
    })
  }
}

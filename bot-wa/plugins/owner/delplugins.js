// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN DELPLUGINS
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

module.exports = {
  command: ['delplugins', 'delplugin'],
  description: 'Hapus plugin dari bot',
  ownerOnly: true,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0] || !args[1]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.delplugins tools sticker*\n\n📁 Folder tersedia:\n- main\n- tools\n- ai\n- owner\n- group`)
    }

    const folder = args[0].toLowerCase()
    const namaPlugin = args[1].toLowerCase()

    const validFolders = ['main', 'tools', 'ai', 'owner', 'group']
    if (!validFolders.includes(folder)) {
      return await reply(`❌ Folder tidak valid!\n\nFolder tersedia:\n${validFolders.join(', ')}`)
    }

    const filePath = path.join(__dirname, `../../plugins/${folder}/${namaPlugin}.js`)

    if (!fs.existsSync(filePath)) {
      return await reply(`❌ Plugin *${namaPlugin}.js* tidak ditemukan di folder *${folder}*!`)
    }

    try {
      // Hapus dari cache
      delete require.cache[require.resolve(filePath)]

      // Hapus file
      fs.unlinkSync(filePath)

      await reply(`✅ Plugin *${namaPlugin}.js* berhasil dihapus dari folder *${folder}*!\n\n⚠️ Restart bot untuk menerapkan perubahan!`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal menghapus plugin, coba lagi!')
    }
  }
}

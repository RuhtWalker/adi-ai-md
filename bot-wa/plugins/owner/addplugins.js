// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN ADDPLUGINS
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')
const { downloadContentFromMessage } = require('alipclutch-baileys')

module.exports = {
  command: ['addplugins', 'addplugin'],
  description: 'Tambah plugin baru dari file .js',
  ownerOnly: true,

  async execute({ sock, from, msg, args, config, reply }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const doc = msg.message?.documentMessage || quoted?.documentMessage

    if (!doc) {
      return await reply(`❌ Reply file .js dengan caption *.addplugins [folder] [nama]*\n\nContoh:\n*.addplugins tools sticker*\n\n📁 Folder tersedia:\n- main\n- tools\n- ai\n- owner\n- group`)
    }

    if (!doc.fileName?.endsWith('.js') && !doc.mimetype?.includes('javascript') && !doc.mimetype?.includes('text')) {
      return await reply('❌ File harus berformat *.js*!')
    }

    if (!args[0] || !args[1]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.addplugins tools sticker*`)
    }

    const folder = args[0].toLowerCase()
    const namaPlugin = args[1].toLowerCase()

    const validFolders = ['main', 'tools', 'ai', 'owner', 'group']
    if (!validFolders.includes(folder)) {
      return await reply(`❌ Folder tidak valid!\n\nFolder tersedia:\n${validFolders.join(', ')}`)
    }

    await reply('⏳ Sedang mengupload plugin...')

    try {
      const stream = await downloadContentFromMessage(doc, 'document')
      let chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      const folderPath = path.join(__dirname, `../../plugins/${folder}`)
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })

      const filePath = path.join(folderPath, `${namaPlugin}.js`)
      fs.writeFileSync(filePath, buffer)

      // Reload plugin
      delete require.cache[require.resolve(filePath)]
      const plugin = require(filePath)

      await reply(`✅ Plugin *${namaPlugin}.js* berhasil ditambahkan ke folder *${folder}*!\n\n⚠️ Restart bot untuk mengaktifkan plugin baru!`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal menambahkan plugin, coba lagi!')
    }
  }
}

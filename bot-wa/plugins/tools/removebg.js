// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN REMOVEBG
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

module.exports = {
  command: ['removebg', 'rmbg'],
  description: 'Hapus background gambar',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const image = msg.message?.imageMessage || quoted?.imageMessage

    if (!image) {
      return await reply(`❌ Kirim/reply gambar dengan caption *.removebg*`)
    }

    await reply('⏳ Sedang menghapus background...')

    try {
      // Download gambar
      const stream = await downloadContentFromMessage(image, 'image')
      let chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      // Upload ke telegraph dulu biar dapat URL
      const FormData = require('form-data')
      const form = new FormData()
      form.append('file', buffer, 'image.jpg')

      const upload = await axios.post('https://telegra.ph/upload', form, {
        headers: form.getHeaders()
      })

      const imageUrl = `https://telegra.ph${upload.data[0].src}`

      // Kirim ke API removebg
      const res = await axios.post('https://www.puruboy.kozow.com/api/tools/removebg', {
        url: imageUrl
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      })

      const data = res.data

      if (!data.url && data.status !== 'success') {
        return await reply('❌ Gagal menghapus background, coba lagi!')
      }

      const resultUrl = data.url

      const result = await axios.get(resultUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      })

      await sock.sendMessage(from, {
        image: Buffer.from(result.data),
        caption: `✅ Background berhasil dihapus!\n\n✦ © *Powered by Adii Clutch* 🚀`
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal menghapus background, coba lagi!')
    }
  }
}

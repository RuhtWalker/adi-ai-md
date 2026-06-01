// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN BRAT
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['brat'],
  description: 'Buat gambar brat style',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.brat hai kamu siapa sih*`)
    }

    const text = args.join(' ')
    await reply('⏳ Sedang membuat gambar brat...')

    try {
      const res = await axios.post('https://puruboy-api.vercel.app/api/tools/brat', {
        text: text
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data
      console.log(data)

      if (!data.success) {
        return await reply('❌ Gagal membuat gambar, coba lagi!')
      }

      const imageUrl = data.url || data.result || data.image

      if (!imageUrl) {
        return await reply('❌ Gagal mendapatkan gambar!')
      }

      const image = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      })

      await sock.sendMessage(from, {
        image: Buffer.from(image.data),
        caption: `✅ *Brat Style*\n📝 Text: ${text}\n\n✦ © *Powered by Adii Clutch* 🚀`
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal membuat gambar brat, coba lagi!')
    }
  }
}

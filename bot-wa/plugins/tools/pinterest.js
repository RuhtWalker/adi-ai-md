// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN PINTEREST
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['pinterest', 'pin'],
  description: 'Cari gambar di Pinterest',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.pinterest anime wallpaper*`)
    }

    const query = args.join(' ')
    await reply('🔍 Mencari gambar di Pinterest...')

    try {
      const res = await axios.get(`https://www.puruboy.kozow.com/api/search/pinterest?q=${encodeURIComponent(query)}`)

      const data = res.data

      if (!data.success || !data.result?.length) {
        return await reply('❌ Gambar tidak ditemukan!')
      }

      // Ambil gambar random dari hasil
      const images = data.result
      const randomImg = images[Math.floor(Math.random() * images.length)]
      const imageUrl = randomImg.image
      const title = randomImg.title || query

      const image = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      })

      await sock.sendMessage(from, {
        image: Buffer.from(image.data),
        caption: `🖼️ *Pinterest*\n📌 ${title}\n🔍 Keyword: ${query}\n\n✦ © *Powered by Adii Clutch* 🚀`
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal mencari gambar, coba lagi!')
    }
  }
}

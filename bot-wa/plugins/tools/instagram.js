// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN INSTAGRAM
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['instagram', 'ig'],
  description: 'Download video/foto Instagram',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.ig https://www.instagram.com/reel/xxxxx*`)
    }

    const url = args[0]
    await reply('⏳ Sedang mendownload dari Instagram...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/downloader/instagram', {
        url: url
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data
      console.log(data)

      if (!data.success) {
        return await reply('❌ Gagal download, coba lagi!')
      }

      const result = data.result
      const mediaUrl = result?.url || result?.video || result?.image

      if (!mediaUrl) {
        return await reply('❌ Gagal mendapatkan link media!')
      }

      const media = await axios.get(mediaUrl, {
        responseType: 'arraybuffer',
        timeout: 60000
      })

      // Cek apakah video atau gambar
      const isVideo = mediaUrl.includes('.mp4') || result?.type === 'video'

      if (isVideo) {
        await sock.sendMessage(from, {
          video: Buffer.from(media.data),
          mimetype: 'video/mp4',
          fileName: 'instagram.mp4',
          caption: `✅ *Instagram Video*\n\n✦ © *Powered by Adii Clutch* 🚀`
        }, { quoted: msg })
      } else {
        await sock.sendMessage(from, {
          image: Buffer.from(media.data),
          caption: `✅ *Instagram Photo*\n\n✦ © *Powered by Adii Clutch* 🚀`
        }, { quoted: msg })
      }

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal download Instagram, coba lagi!')
    }
  }
}

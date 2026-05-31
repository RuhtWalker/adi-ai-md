// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN TIKTOK
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['tiktok', 'tt'],
  description: 'Download video TikTok tanpa watermark',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.tiktok https://vt.tiktok.com/xxxxx*`)
    }

    const url = args[0]
    await reply('⏳ Sedang mendownload video TikTok...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/downloader/tiktok', {
        url: url
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data

      if (!data.success) {
        return await reply('❌ Gagal download, coba lagi!')
      }

      const detail = data.result.detail
      const title = detail.title || 'TikTok Video'
      const duration = detail.duration || 0
      const videoUrl = detail.play_url

      if (!videoUrl) {
        return await reply('❌ Gagal mendapatkan link video!')
      }

      const video = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        timeout: 60000
      })

      await sock.sendMessage(from, {
        video: Buffer.from(video.data),
        mimetype: 'video/mp4',
        fileName: 'tiktok.mp4',
        caption: `✅ *${title}*\n⏱️ Durasi: ${duration} detik\n\n✦ © *Powered by Adii Clutch* 🚀`
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal download TikTok, coba lagi!')
    }
  }
}

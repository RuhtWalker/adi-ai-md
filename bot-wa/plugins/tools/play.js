// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN PLAY
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['play', 'musik', 'lagu'],
  description: 'Download lagu/video YouTube',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.play shape of you*`)
    }

    const query = args.join(' ')
    await reply('🔍 Mencari lagu...')

    try {
      const search = await axios.get(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(query)}`)

      if (!search.data?.data?.length) {
        return await reply('❌ Lagu tidak ditemukan!')
      }

      const video = search.data.data[0]
      const title = video.title
      const channel = video.author?.name || 'Unknown'
      const duration = video.duration?.timestamp || video.duration || 'Unknown'
      const views = video.views || 'Unknown'
      const thumb = video.thumbnail || video.image
      const videoUrl = video.url

      const caption = `⊱──────────────────⊰
▶️ *${title}*
⊱──────────────────⊰

📺 Channel : ${channel}
⏱️ Durasi  : ${duration}
👁️ Views   : ${views}

⊱──────────────────⊰
  ✦ © *Powered by Adii Clutch* 🚀
⊱──────────────────⊰`

      const img = await axios.get(thumb, { responseType: 'arraybuffer' })

      await sock.sendMessage(from, {
        image: Buffer.from(img.data),
        caption,
        templateButtons: [
          {
            index: 1,
            quickReplyButton: {
              displayText: '🎵 Musik',
              id: `.ytmp3 ${videoUrl}`
            }
          },
          {
            index: 2,
            quickReplyButton: {
              displayText: '🎬 Video',
              id: `.ytmp4 ${videoUrl}`
            }
          }
        ],
        headerType: 4
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal mencari lagu, coba lagi!')
    }
  }
}

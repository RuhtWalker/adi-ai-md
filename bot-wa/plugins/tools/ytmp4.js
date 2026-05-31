// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN YTMP4
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const ytdl = require('ytdl-core')

module.exports = {
  command: ['ytmp4'],
  description: 'Download video YouTube',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.ytmp4 https://youtu.be/xxxxx*`)
    }

    const url = args.join(' ')

    if (!ytdl.validateURL(url)) {
      return await reply('❌ URL YouTube tidak valid!')
    }

    await reply('⏳ Sedang mendownload video...')

    try {
      const info = await ytdl.getInfo(url)
      const title = info.videoDetails.title
      const duration = info.videoDetails.lengthSeconds

      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

      const chunks = []
      const stream = ytdl(url, { filter: 'videoandaudio', quality: 'highest' })

      stream.on('data', chunk => chunks.push(chunk))
      stream.on('end', async () => {
        const buffer = Buffer.concat(chunks)
        await sock.sendMessage(from, {
          video: buffer,
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`,
          caption: `✅ *${title}*\n⏱️ Durasi: ${durationStr}\n\n✦ © *Powered by Adii Clutch* 🚀`
        }, { quoted: msg })
      })

      stream.on('error', async (err) => {
        await reply('❌ Gagal download video, coba lagi!')
      })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal download video, coba lagi!')
    }
  }
}

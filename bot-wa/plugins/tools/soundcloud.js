// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN SOUNDCLOUD
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['soundcloud', 'sc'],
  description: 'Download lagu dari SoundCloud',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.soundcloud dj ya odna*`)
    }

    const query = args.join(' ')
    await reply('🔍 Mencari lagu di SoundCloud...')

    try {
      const res = await axios.get(`https://www.puruboy.kozow.com/api/play/soundcloud?q=${encodeURIComponent(query)}`)

      const data = res.data
      console.log(data)

      if (!data.success) {
        return await reply('❌ Lagu tidak ditemukan!')
      }

      const result = data.result
      const title = result?.title || 'Unknown'
      const artist = result?.artist || 'Unknown'
      const duration = result?.duration || 'Unknown'
      const audioUrl = result?.url || result?.audio || result?.download

      if (!audioUrl) {
        return await reply('❌ Gagal mendapatkan link audio!')
      }

      await reply(`⏳ Mendownload *${title}*...`)

      const audio = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 60000
      })

      await sock.sendMessage(from, {
        audio: Buffer.from(audio.data),
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: msg })

      await reply(`✅ *${title}*\n👤 Artist: ${artist}\n⏱️ Durasi: ${duration}\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal download SoundCloud, coba lagi!')
    }
  }
}

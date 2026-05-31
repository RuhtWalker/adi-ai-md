// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN TTS
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['tts', 'suara'],
  description: 'Ubah teks menjadi suara',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.tts halo apa kabar?*`)
    }

    const text = args.join(' ')
    await reply('⏳ Sedang memproses suara...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/dracin', {
        text: text,
        music: true
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data

      if (!data.success) {
        return await reply('❌ Gagal memproses suara, coba lagi!')
      }

      const audioUrl = data.result?.audio

      if (!audioUrl) {
        return await reply('❌ Gagal mendapatkan link audio!')
      }

      const audio = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      })

      await sock.sendMessage(from, {
        audio: Buffer.from(audio.data),
        mimetype: 'audio/mp4',
        ptt: false
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses suara, coba lagi!')
    }
  }
}

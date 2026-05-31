// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN GEMINI
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['gemini', 'gm'],
  description: 'Chat dengan Gemini AI',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.gemini apa itu JavaScript?*`)
    }

    const prompt = args.join(' ')
    await reply('⏳ Sedang memproses...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/gemini', {
        prompt: prompt
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data

      if (!data.success) {
        return await reply('❌ Gagal mendapatkan respon, coba lagi!')
      }

      let response = data.result?.answer || data.result || data.answer

      if (!response) {
        return await reply('❌ Gagal mendapatkan respon, coba lagi!')
      }

      response = response.replace(/\*\*([^*]+)\*\*/g, '*$1*')
      response = response.replace(/#{1,6}\s?/g, '')

      await reply(`✨ *Gemini AI*\n\n${response}\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses, coba lagi!')
    }
  }
}

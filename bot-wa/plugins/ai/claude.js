// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN CLAUDE AI
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['claude', 'cl'],
  description: 'Chat dengan Claude AI',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.claude apa itu JavaScript?*`)
    }

    const question = args.join(' ')
    await reply('⏳ Sedang memproses...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/overchat', {
        question: question
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data

      if (!data.result) {
        return await reply('❌ Gagal mendapatkan respon, coba lagi!')
      }

      let response = data.result
      response = response.replace(/\*\*([^*]+)\*\*/g, '*$1*')

      await reply(`🤖 *Claude AI*\n\n${response}\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses, coba lagi!')
    }
  }
}

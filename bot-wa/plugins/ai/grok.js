// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN GROK AI
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['grok', 'gr'],
  description: 'Chat dengan Grok AI',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.grok siapa pencipta JavaScript?*`)
    }

    const message = args.join(' ')
    await reply('⏳ Sedang memproses...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/grok', {
        message: message
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data
      console.log(data)

      if (!data.success) {
        return await reply('❌ Gagal mendapatkan respon, coba lagi!')
      }

      let response = data.result
      response = response.replace(/\*\*([^*]+)\*\*/g, '*$1*')
      response = response.replace(/#{1,6}\s?/g, '')

      await reply(`⚡ *Grok AI*\n\n${response}\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses, coba lagi!')
    }
  }
}

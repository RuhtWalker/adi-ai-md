// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN UNLIMITED AI
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['unlimited', 'ul'],
  description: 'Chat dengan Unlimited AI',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.unlimited buatkan cerita pendek*`)
    }

    const message = args.join(' ')
    await reply('⏳ Sedang memproses...')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/unlimited', {
        message: message
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000,
        responseType: 'stream'
      })

      let fullText = ''

      await new Promise((resolve, reject) => {
        res.data.on('data', chunk => {
          fullText += chunk.toString()
        })
        res.data.on('end', resolve)
        res.data.on('error', reject)
      })

      if (!fullText) {
        return await reply('❌ Gagal mendapatkan respon, coba lagi!')
      }

      fullText = fullText.replace(/\*\*([^*]+)\*\*/g, '*$1*')
      fullText = fullText.replace(/#{1,6}\s?/g, '')

      await reply(`🤖 *Unlimited AI*\n\n${fullText}\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses, coba lagi!')
    }
  }
}

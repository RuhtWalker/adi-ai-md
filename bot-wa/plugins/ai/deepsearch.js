// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN DEEPSEARCH
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['deepsearch', 'ds'],
  description: 'Cari informasi mendalam dengan AI',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.deepsearch jelaskan tentang black hole*`)
    }

    const prompt = args.join(' ')
    await reply('🔍 Sedang mencari informasi mendalam...\n\n_Proses ini membutuhkan waktu lebih lama_')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/deepsearch', {
        prompt: prompt,
        modelType: 'reasoner'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
        responseType: 'stream'
      })

      let fullText = ''
      let reasoning = ''

      await new Promise((resolve, reject) => {
        res.data.on('data', chunk => {
          const lines = chunk.toString().split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6))
                if (json.type === 'text') {
                  fullText += json.content
                } else if (json.type === 'reasoning') {
                  reasoning += json.content
                }
              } catch {}
            }
          }
        })
        res.data.on('end', resolve)
        res.data.on('error', reject)
      })

      if (!fullText) {
        return await reply('❌ Gagal mendapatkan respon, coba lagi!')
      }

      fullText = fullText.replace(/\*\*([^*]+)\*\*/g, '*$1*')
      fullText = fullText.replace(/#{1,6}\s?/g, '')

      await reply(`🔍 *DeepSearch AI*\n\n${fullText}\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses, coba lagi!')
    }
  }
}

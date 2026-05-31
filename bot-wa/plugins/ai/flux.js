// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN FLUX AI
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['flux', 'imagine', 'buatgambar'],
  description: 'Generate gambar dengan AI',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    if (!args[0]) {
      return await reply(`❌ Format salah!\n\nContoh:\n*.flux cyberpunk city with neon lights*`)
    }

    const prompt = args.join(' ')
    await reply('⏳ Sedang membuat gambar...\n\n_Proses ini membutuhkan waktu beberapa detik_')

    try {
      const res = await axios.post('https://www.puruboy.kozow.com/api/ai/flux', {
        prompt: prompt
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
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

      // Cek apakah berhasil atau gagal
      if (fullText.includes('[false]')) {
        const errorMsg = fullText.replace('[false]', '').trim()
        if (errorMsg.includes('Rate limit')) {
          return await reply('❌ Terlalu banyak request! Coba lagi dalam 1 menit!')
        }
        return await reply(`❌ Gagal: ${errorMsg}`)
      }

      if (!fullText.includes('[true]')) {
        return await reply('❌ Gagal generate gambar, coba lagi!')
      }

      // Ambil URL hasil
      const resultUrl = fullText.replace('[true]', '').trim()

      if (!resultUrl) {
        return await reply('❌ Gagal mendapatkan URL gambar!')
      }

      // Fetch result JSON
      const resultRes = await axios.get(resultUrl, { timeout: 30000 })
      const resultData = resultRes.data

      const imageUrl = resultData.url || resultData.image || resultData.result || resultData

      if (!imageUrl) {
        return await reply('❌ Gagal mendapatkan gambar, coba lagi!')
      }

      const image = await axios.get(typeof imageUrl === 'string' ? imageUrl : imageUrl.url, {
        responseType: 'arraybuffer',
        timeout: 30000
      })

      await sock.sendMessage(from, {
        image: Buffer.from(image.data),
        caption: `✅ *Gambar berhasil dibuat!*\n\n🎨 *Prompt:* ${prompt}\n\n✦ © *Powered by Adii Clutch* 🚀`
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal generate gambar, coba lagi!')
    }
  }
}

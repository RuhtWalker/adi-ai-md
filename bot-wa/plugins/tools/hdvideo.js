// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN HD VIDEO
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')
const { downloadContentFromMessage } = require('alipclutch-baileys')

async function uploadToCatbox(buffer, filename) {
  const FormData = require('form-data')
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, filename)

  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    timeout: 60000
  })
  return res.data
}

async function pollStatus(pollingUrl, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(r => setTimeout(r, 5000))
    const res = await axios.get(pollingUrl, { timeout: 30000 })
    const data = res.data
    console.log('Poll status:', data)

    if (data.success && data.result?.status === 'success') {
      return data.result
    }
    if (data.result?.status === 'failed' || data.result?.status === 'error') {
      throw new Error('Processing failed')
    }
  }
  throw new Error('Timeout waiting for result')
}

module.exports = {
  command: ['hdvid', 'hdvideo'],
  description: 'Enhance video menjadi HD',
  ownerOnly: false,

  async execute({ sock, from, msg, args, config, reply }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const video = msg.message?.videoMessage || quoted?.videoMessage

    if (!video) {
      return await reply(`❌ Kirim/reply video dengan caption *.hdvid*`)
    }

    await reply('⏳ Sedang upload video...')

    try {
      // Download video
      const stream = await downloadContentFromMessage(video, 'video')
      let chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      // Upload ke catbox
      const videoUrl = await uploadToCatbox(buffer, 'video.mp4')

      if (!videoUrl || !videoUrl.startsWith('http')) {
        return await reply('❌ Gagal upload video!')
      }

      // Kirim ke API HD
      const res = await axios.post('https://puruboy-api.vercel.app/api/tools/hdvideo', {
        url: videoUrl
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const data = res.data

      if (!data.pollingUrl) {
        return await reply('❌ Gagal memproses video, coba lagi!')
      }

      await reply('⏳ Video sedang diproses, mohon tunggu beberapa menit...')

      // Poll status
      const result = await pollStatus(data.pollingUrl)
      const resultUrl = result.url

      if (!resultUrl) {
        return await reply('❌ Gagal mendapatkan link video!')
      }

      const videoResult = await axios.get(resultUrl, {
        responseType: 'arraybuffer',
        timeout: 120000
      })

      await sock.sendMessage(from, {
        video: Buffer.from(videoResult.data),
        mimetype: 'video/mp4',
        fileName: result.file_name || 'hd_video.mp4',
        caption: `✅ *Video berhasil di-enhance ke HD!*\n\n✦ © *Powered by Adii Clutch* 🚀`
      }, { quoted: msg })

    } catch (err) {
      console.log(err)
      await reply('❌ Gagal memproses video HD, coba lagi!')
    }
  }
}

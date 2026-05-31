// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN CHAT AI
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')
const FormData = require('form-data')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

const API_KEY = 'cov_live_665b4c7dc6def02bf04862b4f0aabe2acd5b72dca69b4c2a'
const API_URL = 'https://api.covenant.sbs/api/ai/gemini'

async function extractMedia(msg) {
  if (!msg) return null
  try {
    if (msg.imageMessage) {
      const stream = await downloadContentFromMessage(msg.imageMessage, 'image')
      let chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      return { buffer: Buffer.concat(chunks), filename: 'image.jpg' }
    }
    if (msg.videoMessage) {
      const stream = await downloadContentFromMessage(msg.videoMessage, 'video')
      let chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      return { buffer: Buffer.concat(chunks), filename: 'video.mp4' }
    }
    if (msg.audioMessage) {
      const stream = await downloadContentFromMessage(msg.audioMessage, 'audio')
      let chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      return { buffer: Buffer.concat(chunks), filename: 'audio.mp3' }
    }
  } catch (e) {
    console.error('Extract media error:', e)
  }
  return null
}

module.exports = {
  command: ['ai', 'tanya'],
  description: 'Chat dengan AI Gemini',
  ownerOnly: false,

  async execute({ sock, msg, from, sender, args, config }) {
    let question = args.join(' ')
    let mediaBuffer = null
    let mediaFilename = null
    let hasMedia = false

    // Cek media di pesan
    const media = await extractMedia(msg.message)
    if (media) {
      mediaBuffer = media.buffer
      mediaFilename = media.filename
      hasMedia = true
      if (msg.message?.imageMessage?.caption) question = msg.message.imageMessage.caption
      if (msg.message?.videoMessage?.caption) question = msg.message.videoMessage.caption
    }

    // Cek media di reply
    if (!hasMedia && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage
      const quotedMedia = await extractMedia(quotedMsg)
      if (quotedMedia) {
        mediaBuffer = quotedMedia.buffer
        mediaFilename = quotedMedia.filename
        hasMedia = true
      }
    }

    if (!question && !hasMedia) {
      return await sock.sendMessage(from, {
        text: `📌 *Contoh penggunaan:*\n\n*.ai apa itu JavaScript?*\n*.ai* (kirim gambar) jelaskan gambar ini\n*.ai* (reply video) analisis video ini\n\n✅ Support: Teks, Gambar, Video, Audio`
      })
    }

    await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } })
    await sock.sendMessage(from, { text: '⏳ Sedang memproses...' })

    try {
      const formData = new FormData()
      const userNick = msg.pushName || sender.split('@')[0]

      let finalQuestion = question
      if (!finalQuestion && hasMedia) {
        if (mediaFilename?.includes('image')) finalQuestion = 'Jelaskan gambar ini secara singkat dan jelas. Gunakan emoji.'
        else if (mediaFilename?.includes('video')) finalQuestion = 'Analisis video ini secara singkat dan jelas. Gunakan emoji.'
        else if (mediaFilename?.includes('audio')) finalQuestion = 'Transkrip audio ini dan jelaskan secara singkat. Gunakan emoji.'
        else finalQuestion = 'Analisis file ini secara singkat dan jelas.'
      }
      if (!finalQuestion) finalQuestion = 'Halo!'

      formData.append('question', finalQuestion)
      formData.append('sessionId', `${sender.split('@')[0]}_${Date.now()}`)
      formData.append('system', `Kamu adalah ${config.namaBot}, asisten AI yang asik, santai, dan ramah. Panggil user dengan nama "${userNick}". Gunakan bahasa Indonesia gaul yang natural. Jawab SINGKAT, PADAT, dan LANGSUNG ke inti. JANGAN gunakan markdown seperti ** atau *. Gunakan emoji biar lebih asik. Maksimal 3-4 kalimat.`)

      if (mediaBuffer) {
        formData.append('file', mediaBuffer, { filename: mediaFilename })
      }

      const response = await axios.post(API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': API_KEY
        },
        timeout: 120000
      })

      const result = response.data
      if (!result.status || !result.data?.result) {
        throw new Error(result.message || 'Gagal mendapatkan respon')
      }

      let aiResponse = result.data.result
      aiResponse = aiResponse.replace(/\*\*([^*]+)\*\*/g, '$1')
      aiResponse = aiResponse.replace(/\*([^*]+)\*/g, '$1')
      aiResponse = aiResponse.replace(/#{1,6}\s?/g, '')
      aiResponse = aiResponse.replace(/Covenant/gi, config.namaBot)
      aiResponse = aiResponse.replace(/Ritz/gi, userNick)

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } })
      await sock.sendMessage(from, { text: aiResponse })

    } catch (error) {
      await sock.sendMessage(from, { react: { text: '❌', key: msg.key } })

      let errorMsg = 'Gagal memproses, coba lagi!'
      if (error.code === 'ECONNABORTED') errorMsg = 'Timeout, coba lagi nanti!'
      if (error.response?.status === 429) errorMsg = 'Terlalu banyak request, coba lagi nanti!'
      if (error.response?.status === 401) errorMsg = 'API key tidak valid!'

      await sock.sendMessage(from, { text: `❌ ${errorMsg}` })
    }
  }
}

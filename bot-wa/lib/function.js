// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - FUNCTION LIB
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const os = require('os')

// Format ukuran file
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
}

// Format waktu uptime
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h} jam ${m} menit ${s} detik`
}

// Format tanggal Indonesia
function formatDate(date = new Date()) {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format waktu Indonesia
function formatTime(date = new Date()) {
  return date.toLocaleTimeString('id-ID')
}

// Sleep/delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Random pilih dari array
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Kirim pesan dengan button saluran
async function sendWithButton(sock, from, msg, text, config) {
  try {
    await sock.sendMessage(from, {
      interactiveMessage: {
        title: text,
        footer: '',
        nativeFlowMessage: {
          buttons: [
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '📢 Lihat Saluran',
                url: config.linkSaluran || 'https://whatsapp.com',
                merchant_url: config.linkSaluran || 'https://whatsapp.com'
              })
            }
          ]
        }
      }
    }, { quoted: msg })
  } catch (err) {
    await sock.sendMessage(from, { text }, { quoted: msg })
  }
}

// Kirim gambar dengan button saluran
async function sendImageWithButton(sock, from, msg, image, caption, config) {
  try {
    await sock.sendMessage(from, {
      image,
      caption,
    }, { quoted: msg })
  } catch (err) {
    await sock.sendMessage(from, { image, caption }, { quoted: msg })
  }
}

module.exports = {
  formatSize,
  formatUptime,
  formatDate,
  formatTime,
  sleep,
  random,
  sendWithButton,
  sendImageWithButton
}

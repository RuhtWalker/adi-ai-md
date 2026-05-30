// ================================================================
// ⊱──────────────────────────────────────────⊰
//           🤖 ADI AI MD - MAIN FILE
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
//   Dilarang menghapus credit ini!
// ⊱──────────────────────────────────────────⊰
// ================================================================

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const readline = require('readline')
const axios = require('axios')
const config = require('./config')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  })

  if (!sock.authState.creds.registered) {
    const number = await question('Masukkan nomor WhatsApp kamu (contoh: 628xxxxxxxxxx): ')
    const code = await sock.requestPairingCode(number)
    console.log('Pairing code kamu:', code)
  }

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'close') {
      console.log('Koneksi terputus, reconnecting...')
      startBot()
    }
    if (connection === 'open') {
      console.log(`${config.namaBot} berhasil terhubung!`)
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const text = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || ''
    const from = msg.key.remoteJid

    if (!text) return

    if (text === `${config.prefix}ping`) {
      await sock.sendMessage(from, { text: 'Pong! 🏓' })
    }

    if (text === `${config.prefix}menu`) {
      const caption = `⊱──────────────────⊰
      🤖 *${config.namaBot}* 🤖
⊱──────────────────⊰

❥ 👤 Owner : *${config.owner}*
❥ ⏰ Waktu : ${new Date().toLocaleTimeString('id-ID')}
❥ 📅 Date  : ${new Date().toLocaleDateString('id-ID')}

⊱──────────────────⊰
      📌 *PERINTAH*
⊱──────────────────⊰

✧ 🏓 *${config.prefix}ping* » Cek bot
✧ 📋 *${config.prefix}menu* » Menu
✧ ℹ️  *${config.prefix}info* » Info bot

⊱──────────────────⊰
  ✦ © *Powered by Adii Clutch* 🚀
⊱──────────────────⊰`

      if (config.thumbnail) {
        const img = await axios.get(config.thumbnail, { responseType: 'arraybuffer' })
        await sock.sendMessage(from, { image: Buffer.from(img.data), caption })
      } else {
        await sock.sendMessage(from, { text: caption })
      }
    }
  })
}

startBot()

// ================================================================
// ⊱──────────────────────────────────────────⊰
//           🤖 ADI AI MD - MAIN FILE
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
//   Dilarang menghapus credit ini!
// ⊱──────────────────────────────────────────⊰
// ================================================================

const { default: makeWASocket, useMultiFileAuthState } = require('alipclutch-baileys')
const pino = require('pino')
const readline = require('readline')
const { messageHandler, groupHandler } = require('./handler/message')
const config = require('./config')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session')

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
      console.log(`✅ ${config.namaBot} berhasil terhubung!`)
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    await messageHandler(sock, messages[0])
  })

  sock.ev.on('group-participants.update', async (update) => {
    await groupHandler(sock, update)
  })
}

startBot()

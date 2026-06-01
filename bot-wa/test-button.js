const { default: makeWASocket, useMultiFileAuthState } = require('alipclutch-baileys')
const pino = require('pino')

async function test() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  })

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async ({ connection }) => {
    if (connection === 'open') {
      console.log('Connected!')
      
      const jid = '6285268752593@s.whatsapp.net'
      
      const msg = await sock.sendMessage(jid, {
        interactiveMessage: {
          header: {
            title: 'Test Menu',
            hasMediaAttachment: false
          },
          body: { text: 'Pilih menu di bawah!' },
          footer: { text: 'Powered by Adii Clutch' },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({ display_text: '🏓 Ping', id: '.ping' })
              },
              {
                name: 'quick_reply', 
                buttonParamsJson: JSON.stringify({ display_text: '📋 Menu', id: '.menu' })
              },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '📢 Saluran',
                  url: 'https://whatsapp.com/channel/0029Vb7IPAcBKfhrftjWca3f'
                })
              }
            ]
          }
        }
      })
      console.log('Sent!', msg)
    }
  })
}

test()

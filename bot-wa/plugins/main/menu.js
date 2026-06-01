// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN MENU
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}j ${m}m ${s}d`
}

module.exports = {
  command: ['menu', 'help'],
  description: 'Tampilkan menu bot',
  ownerOnly: false,

  async execute({ sock, from, msg, config, reply }) {
    const uptime = formatUptime(process.uptime())
    const userName = msg.pushName || 'User'
    const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const menuText = `╭─❏ 𝗜𝗻𝗳𝗼 𝗕𝗼𝘁
│▣ Bot Name : *${config.namaBot}*
│▣ Status   : *Online 24 Jam*
│▣ Uptime   : *${uptime}*
╰──────────❏

╭─❏ 𝗜𝗻𝗳𝗼 𝗨𝘀𝗲𝗿
│▣ Nama  : *${userName}*
│▣ Owner : *${config.owner}*
│▣ Date  : *${new Date().toLocaleDateString('id-ID')}*
│▣ Time  : *${new Date().toLocaleTimeString('id-ID')}*
╰──────────❏`

    const sections = [
      {
        title: '📂 Kategori Menu',
        highlight_label: 'Pilih Kategori',
        rows: [
          { title: '📌 Menu Utama', description: 'Ping, Info, Total Fitur', id: `${config.prefix}menu-utama` },
          { title: '🤖 Menu AI', description: 'AI Chat, Gemini, Grok, Claude, Flux', id: `${config.prefix}menu-ai` },
          { title: '📥 Menu Download', description: 'YouTube, TikTok, Instagram', id: `${config.prefix}menu-download` },
          { title: '🔧 Menu Tools', description: 'Pinterest, TTS, Tsundere', id: `${config.prefix}menu-tools` },
          { title: '👥 Menu Grup', description: 'Welcome, Antilink, Bye', id: `${config.prefix}menu-grup` },
          { title: '👑 Menu Owner', description: 'Addcase, Backup, GetSC', id: `${config.prefix}menu-owner` }
        ]
      }
    ]

    try {
      await sock.sendMessage(from, {
        interactiveMessage: {
          title: menuText,
          footer: '',
          thumbnail: config.thumbnail,
          nativeFlowMessage: {
            messageParamsJson: JSON.stringify({
              limited_time_offer: {
                text: config.namaBot,
                url: config.namaBot,
                copy_code: tanggal,
                expiration_time: null
              },
              bottom_sheet: {
                in_thread_buttons_limit: 2,
                divider_indices: [1, 2, 3, 999],
                list_title: config.namaBot,
                button_title: '📂 Buka Menu'
              },
              tap_target_configuration: {
                title: '▸ Info ◂',
                description: 'Klik untuk menu',
                canonical_url: config.namaBot,
                domain: 'shop.example.com',
                button_index: 0
              }
            }),
            buttons: [
              { name: 'single_select', buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
              { name: 'call_permission_request', buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }) },
              { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📂 Buka Menu', sections, has_multiple_buttons: true }) },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '📢 Saluran',
                  url: config.linkSaluran || 'https://whatsapp.com',
                  merchant_url: config.linkSaluran || 'https://whatsapp.com'
                })
              },
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({ display_text: '👤 Owner', id: `${config.prefix}info` })
              },
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({ display_text: '🏓 Ping', id: `${config.prefix}ping` })
              }
            ]
          }
        },
        contextInfo: {
          mentionedJid: [msg.key.participant || from],
          externalAdReply: {
            title: config.namaBot,
            body: config.owner,
            thumbnailUrl: config.thumbnail,
            sourceUrl: config.linkSaluran || 'https://whatsapp.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: msg })

    } catch (err) {
      console.log('Menu error:', err.message)
      await reply(`${menuText}\n\n👤 *Contact Owner* : wa.me/${config.noOwner}\n📢 *Saluran* : ${config.linkSaluran}`)
    }
  }
}

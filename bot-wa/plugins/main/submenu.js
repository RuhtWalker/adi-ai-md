// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN SUBMENU
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

module.exports = {
  command: ['menu-utama', 'menu-ai', 'menu-download', 'menu-tools', 'menu-grup', 'menu-owner'],
  description: 'Tampilkan submenu kategori',
  ownerOnly: false,

  async execute({ sock, from, msg, command, config, reply }) {
    const menus = {
      'menu-utama': {
        title: '📌 MENU UTAMA',
        items: [
          { cmd: 'ping', desc: 'Cek bot aktif' },
          { cmd: 'info', desc: 'Info tentang bot' },
          { cmd: 'totalfitur', desc: 'Lihat total fitur' },
          { cmd: 'menu', desc: 'Tampilkan menu' }
        ]
      },
      'menu-ai': {
        title: '🤖 MENU AI',
        items: [
          { cmd: 'ai', desc: 'Chat dengan AI Gemini' },
          { cmd: 'gemini', desc: 'Chat dengan Gemini' },
          { cmd: 'grok', desc: 'Chat dengan Grok AI' },
          { cmd: 'claude', desc: 'Chat dengan Claude AI' },
          { cmd: 'flux', desc: 'Generate gambar AI' },
          { cmd: 'deepsearch', desc: 'Cari informasi mendalam' }
        ]
      },
      'menu-download': {
        title: '📥 MENU DOWNLOAD',
        items: [
          { cmd: 'play', desc: 'Download lagu YouTube' },
          { cmd: 'ytmp3', desc: 'Download audio YouTube' },
          { cmd: 'ytmp4', desc: 'Download video YouTube' },
          { cmd: 'tiktok', desc: 'Download TikTok' },
          { cmd: 'ig', desc: 'Download Instagram' },
          { cmd: 'soundcloud', desc: 'Download SoundCloud' }
        ]
      },
      'menu-tools': {
        title: '🔧 MENU TOOLS',
        items: [
          { cmd: 'pinterest', desc: 'Cari gambar Pinterest' },
          { cmd: 'tts', desc: 'Text to Speech' },
          { cmd: 'tsundere', desc: 'TTS Tsundere' },
          { cmd: 'hdvid', desc: 'Enhance video HD' },
          { cmd: 'removebg', desc: 'Hapus background gambar' }
        ]
      },
      'menu-grup': {
        title: '👥 MENU GRUP',
        items: [
          { cmd: 'welcome', desc: 'Aktifkan welcome member' },
          { cmd: 'setwelcome', desc: 'Atur pesan welcome' },
          { cmd: 'bye', desc: 'Aktifkan bye member' },
          { cmd: 'setbye', desc: 'Atur pesan bye' },
          { cmd: 'antilink', desc: 'Aktifkan antilink' }
        ]
      },
      'menu-owner': {
        title: '👑 MENU OWNER',
        items: [
          { cmd: 'addcase', desc: 'Tambah perintah custom' },
          { cmd: 'delcase', desc: 'Hapus perintah custom' },
          { cmd: 'getcase', desc: 'Lihat perintah custom' },
          { cmd: 'backup', desc: 'Backup file bot' },
          { cmd: 'getsc', desc: 'Ambil source code' },
          { cmd: 'jpm', desc: 'Kirim pesan massal' }
        ]
      }
    }

    const menu = menus[command]
    if (!menu) return

    let text = `⊱──────────────────⊰\n`
    text += `      ${menu.title}\n`
    text += `⊱──────────────────⊰\n\n`

    menu.items.forEach(item => {
      text += `✧ *${config.prefix}${item.cmd}* » ${item.desc}\n`
    })

    text += `\n⊱──────────────────⊰\n`
    text += `  ✦ © *Powered by Adii Clutch* 🚀\n`
    text += `⊱──────────────────⊰`

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
              },
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: '🔙 Kembali ke Menu',
                  id: `${config.prefix}menu`
                })
              }
            ]
          }
        }
      })
    } catch (err) {
      console.log('Submenu error:', err.message)
      await reply(text)
    }
  }
}

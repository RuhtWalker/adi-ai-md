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
        title: '📌 𝗠𝗲𝗻𝘂 𝗨𝘁𝗮𝗺𝗮',
        items: [
          { cmd: 'ping', desc: 'Cek bot aktif' },
          { cmd: 'info', desc: 'Info tentang bot' },
          { cmd: 'totalfitur', desc: 'Lihat total fitur' },
          { cmd: 'menu', desc: 'Tampilkan menu' }
        ]
      },
      'menu-ai': {
        title: '🤖 𝗠𝗲𝗻𝘂 𝗔𝗜',
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
        title: '📥 𝗠𝗲𝗻𝘂 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱',
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
        title: '🔧 𝗠𝗲𝗻𝘂 𝗧𝗼𝗼𝗹𝘀',
        items: [
          { cmd: 'pinterest', desc: 'Cari gambar Pinterest' },
          { cmd: 'tts', desc: 'Text to Speech' },
          { cmd: 'tsundere', desc: 'TTS Tsundere' },
          { cmd: 'hdvid', desc: 'Enhance video HD' },
          { cmd: 'removebg', desc: 'Hapus background gambar' }
        ]
      },
      'menu-grup': {
        title: '👥 𝗠𝗲𝗻𝘂 𝗚𝗿𝘂𝗽',
        items: [
          { cmd: 'welcome', desc: 'Aktifkan welcome member' },
          { cmd: 'setwelcome', desc: 'Atur pesan welcome' },
          { cmd: 'bye', desc: 'Aktifkan bye member' },
          { cmd: 'setbye', desc: 'Atur pesan bye' },
          { cmd: 'antilink', desc: 'Aktifkan antilink' }
        ]
      },
      'menu-owner': {
        title: '👑 𝗠𝗲𝗻𝘂 𝗢𝘄𝗻𝗲𝗿',
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

    let text = `❖━━〔 ${menu.title} 〕━━❖\n\n`
    menu.items.forEach(item => {
      text += `⊛ *${config.prefix}${item.cmd}* » ${item.desc}\n`
    })
    text += `\n❖━━━━━━━━━━━━━━━❖`

    await reply(text)
  }
}

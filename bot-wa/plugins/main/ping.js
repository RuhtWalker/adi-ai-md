// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN PING
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const os = require('os')

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h} jam ${m} menit ${s} detik`
}

function formatMemory(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

module.exports = {
  command: ['ping'],
  description: 'Cek bot aktif',
  ownerOnly: false,

  async execute({ sock, from, config }) {
    const start = Date.now()
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const cpuLoad = os.loadavg()[0].toFixed(2)
    const uptime = formatUptime(process.uptime())
    const ping = Date.now() - start

    await sock.sendMessage(from, { text: `⊱──────────────────⊰
      🤖 *${config.namaBot}*
⊱──────────────────⊰

🏓 *Pong!*
⚡ *Response* : ${ping}ms
⏱️ *Uptime*   : ${uptime}
💾 *Memory*   : ${formatMemory(usedMem)} / ${formatMemory(totalMem)}
💻 *CPU Load* : ${cpuLoad}%

⊱──────────────────⊰
  ✦ © *Powered by Adii Clutch* 🚀
⊱──────────────────⊰` })
  }
}

// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - LOGGER LIB
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const { formatTime, formatDate } = require('./function')

function info(msg) {
  console.log(`[${formatTime()}] ℹ️  INFO : ${msg}`)
}

function success(msg) {
  console.log(`[${formatTime()}] ✅ SUCCESS : ${msg}`)
}

function error(msg) {
  console.log(`[${formatTime()}] ❌ ERROR : ${msg}`)
}

function warn(msg) {
  console.log(`[${formatTime()}] ⚠️  WARN : ${msg}`)
}

function cmd(user, command) {
  console.log(`[${formatTime()}] 🔑 CMD : ${user} → ${command}`)
}

module.exports = { info, success, error, warn, cmd }

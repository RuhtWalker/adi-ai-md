// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - FUNCTION LIB
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const fs = require('fs')
const path = require('path')

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

// Cek apakah string adalah URL
function isUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

// Sleep/delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Random pilih dari array
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Capitalize huruf pertama
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = {
  formatSize,
  formatUptime,
  formatDate,
  formatTime,
  isUrl,
  sleep,
  random,
  capitalize
}

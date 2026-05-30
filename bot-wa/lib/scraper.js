// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - SCRAPER LIB
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

// Fetch data dari URL
async function fetchData(url, options = {}) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      },
      ...options
    })
    return res.data
  } catch (err) {
    throw new Error(`Gagal fetch data: ${err.message}`)
  }
}

// Download file sebagai buffer
async function fetchBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(res.data)
  } catch (err) {
    throw new Error(`Gagal download file: ${err.message}`)
  }
}

// Post data ke URL
async function postData(url, data, options = {}) {
  try {
    const res = await axios.post(url, data, options)
    return res.data
  } catch (err) {
    throw new Error(`Gagal post data: ${err.message}`)
  }
}

module.exports = { fetchData, fetchBuffer, postData }

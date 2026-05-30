// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - UPLOADER LIB
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')
const FormData = require('form-data')

// Upload gambar ke telegra.ph
async function uploadToTelegraph(buffer, filename = 'image.jpg') {
  try {
    const form = new FormData()
    form.append('file', buffer, filename)

    const res = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders()
    })

    return `https://telegra.ph${res.data[0].src}`
  } catch (err) {
    throw new Error(`Gagal upload ke Telegraph: ${err.message}`)
  }
}

// Upload file ke catbox.moe
async function uploadToCatbox(buffer, filename = 'file.zip') {
  try {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, filename)

    const res = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    return res.data
  } catch (err) {
    throw new Error(`Gagal upload ke Catbox: ${err.message}`)
  }
}

module.exports = { uploadToTelegraph, uploadToCatbox }

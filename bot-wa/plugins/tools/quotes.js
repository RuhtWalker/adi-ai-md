// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PLUGIN QUOTES
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

const axios = require('axios')

module.exports = {
  command: ['quotes', 'quote', 'motivasi'],
  description: 'Kata-kata motivasi',
  ownerOnly: false,

  async execute({ sock, from, msg, config, reply }) {
    try {
      const res = await axios.get('https://api.siputzx.my.id/api/r/motivasi')
      const data = res.data

      const quote = data?.data || data?.quote || data?.motivasi || 'Tetap semangat! 💪'

      await reply(`💭 *Quotes of the Day*\n\n_${quote}_\n\n✦ © *Powered by Adii Clutch* 🚀`)

    } catch (err) {
      await reply(`💭 *Quotes of the Day*\n\n_Kesuksesan bukan milik orang yang cepat, tapi milik orang yang tidak pernah berhenti berusaha!_ 💪\n\n✦ © *Powered by Adii Clutch* 🚀`)
    }
  }
}
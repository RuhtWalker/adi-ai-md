// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - PM2 CONFIG
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
// ⊱──────────────────────────────────────────⊰
// ================================================================

module.exports = {
  apps: [
    {
      name: 'ADI-AI-MD',
      script: 'index.js',
      watch: false,
      ignore_watch: ['node_modules', 'auth', 'tmp'],
      max_memory_restart: '512M',
      restart_delay: 3000,
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

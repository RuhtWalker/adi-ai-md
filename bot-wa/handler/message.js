// ================================================================
// ⊱──────────────────────────────────────────⊰
//         🤖 ADI AI MD - MESSAGE HANDLER
// ⊱──────────────────────────────────────────⊰
//   © Powered by Adii Clutch 🚀
//   Dilarang menghapus credit ini!
// ⊱──────────────────────────────────────────⊰
// ================================================================

const config = require('../config')
const fs = require('fs')
const path = require('path')

const pluginCache = {}

function loadPlugins() {
  const pluginFolders = ['main', 'tools', 'ai', 'owner', 'group']
  for (const folder of pluginFolders) {
    const folderPath = path.join(__dirname, '../plugins', folder)
    if (!fs.existsSync(folderPath)) continue
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))
    for (const file of files) {
      const plugin = require(path.join(folderPath, file))
      if (plugin.command) {
        for (const cmd of plugin.command) {
          pluginCache[cmd] = plugin
        }
      }
    }
  }
  console.log(`✅ ${Object.keys(pluginCache).length} plugin berhasil dimuat!`)
}

loadPlugins()

async function messageHandler(sock, msg) {
  try {
    if (!msg.message) return
    if (msg.key.fromMe) return

    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? msg.key.participant : from

    const senderNum = sender.replace(/[^0-9]/g, '')
    const ownerNum = config.noOwner.replace(/[^0-9]/g, '')
    const ownerLid = config.noOwnerLid ? config.noOwnerLid.replace(/[^0-9]/g, '') : ''

    const isOwner = senderNum === ownerNum ||
                    senderNum.endsWith(ownerNum) ||
                    ownerNum.endsWith(senderNum) ||
                    senderNum === ownerLid

    const reply = async (content) => {
      if (typeof content === 'string') {
        return await sock.sendMessage(from, { text: content }, { quoted: msg })
      }
      return await sock.sendMessage(from, content, { quoted: msg })
    }

    // Simpan user ke database
    const usersPath = path.join(__dirname, '../database/users.json')
    const users = JSON.parse(fs.readFileSync(usersPath))
    if (!users[sender]) {
      users[sender] = { firstSeen: new Date().toISOString() }
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
    }

    // Cek antilink
    const antilinkPlugin = pluginCache['antilink']
    if (antilinkPlugin?.onMessage && isGroup) {
      await antilinkPlugin.onMessage({ sock, msg, from, sender, isOwner, config })
    }

    // Ambil teks dari berbagai jenis pesan termasuk button
    let text = msg.message?.conversation ||
               msg.message?.extendedTextMessage?.text ||
               msg.message?.buttonsResponseMessage?.selectedButtonId ||
               msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
               msg.message?.templateButtonReplyMessage?.selectedId || ''

    // Cek interactive response
    try {
      const interactiveResponse = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
      if (interactiveResponse) {
        const parsed = JSON.parse(interactiveResponse)
        if (parsed?.id) text = parsed.id
      }
    } catch {}

    if (!text) return
    if (!text.startsWith(config.prefix)) return

    const args = text.slice(config.prefix.length).trim().split(' ')
    const command = args[0].toLowerCase()
    args.shift()

    if (pluginCache[command]) {
      const plugin = pluginCache[command]
      if (plugin.ownerOnly && !isOwner) {
        return await reply('❌ Fitur ini hanya untuk owner!')
      }
      if (plugin.groupOnly && !isGroup) {
        return await reply('❌ Fitur ini hanya untuk grup!')
      }
      return await plugin.execute({ sock, msg, from, sender, isOwner, isGroup, args, text, command, config, reply })
    }

    const customCase = JSON.parse(fs.readFileSync(path.join(__dirname, '../case/custom.json')))
    const found = customCase.find(c => c.command === command)
    if (found) {
      return await reply(found.response)
    }

  } catch (err) {
    console.log('Error handler:', err)
  }
}

async function groupHandler(sock, update) {
  try {
    const { id, participants, action } = update
    const welcomePlugin = pluginCache['welcome']
    if (!welcomePlugin) return

    if (action === 'add') {
      await welcomePlugin.onMemberJoin({ sock, from: id, participants, config })
    }
    if (action === 'remove') {
      await welcomePlugin.onMemberLeave({ sock, from: id, participants, config })
    }
  } catch (err) {
    console.log('Error group handler:', err)
  }
}

module.exports = { messageHandler, groupHandler, pluginCache, loadPlugins }

const log = require('../../util/logger.js')
const dbOpsGuilds = require('../../util/db/guilds.js')
const Attachment = require('discord.js').Attachment

exports.normal = async (bot, message) => {
  const content = message.content.split(' ')
  if (content.length !== 2) return
  try {
    const guildRss = await dbOpsGuilds.get(content[1])
    if (!guildRss) await message.channel.send('No profile available for guild.')
    const msg = guildRss ? `\`\`\`js\n${JSON.stringify(guildRss, null, 2)}\n\`\`\`` : ''

    if (msg.length < 2000) await message.channel.send(`\`\`\`js\n${JSON.stringify(guildRss, null, 2)}\n\`\`\``)
    else if (msg.length >= 2000) {
      await message.channel.send('Unable to send due to character length exceeding 2000. Logging to console instead.')
      log.owner.info(`Guild ID ${content[1]} data:`, message.author)
      console.log(guildRss)
      await message.channel.send(new Attachment(Buffer.from(JSON.stringify(guildRss, null, 2)), content[1] + '.json'))
    } else await message.channel.send('No data available.')
  } catch (err) {
    log.owner.warning('getguild', err)
    if (err.code !== 50013) message.channel.send(err.message).catch(err => log.owner.warning('getguild 1a', message.guild, err))
  }
}

exports.sharded = exports.normal

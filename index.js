const { Client, GatewayIntentBits, Partials } = require('discord.js')
require('dotenv').config()

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
})

const rulesMessageId = process.env.RULES_MESSAGE_ID
const rulesEmoji = process.env.RULES_EMOJI

const rulesRole = process.env.RULES_ROLE
const memberRole = process.env.MEMBER_ROLE
const adminRole = process.env.ADMIN_ROLE

const botId = process.env.BOT_ID
const token = process.env.TOKEN

client.on('ready', async () => {
    console.log(`${client.user.tag} est en ligne!`)
})

client.on('messageCreate', async (message) => {
    if (message.author.id === botId) return
    if (message.content !== '->syncRoles') return
    const member = await message.guild.members.fetch(message.author.id)
    const isAdmin = member._roles.includes(adminRole)
    if (!isAdmin) return message.channel.send(`Tu ne possèdes pas l'accès à cette commande!`)
    const members = await message.guild.members.fetch()
    return members.forEach(m => m.roles.add(memberRole))
})

client.on('messageReactionAdd', async (reaction, user) => {
    const message = reaction.message

    if (message.id !== rulesMessageId) return
    if (reaction.emoji.name !== rulesEmoji) return reaction.remove()

    const member = await message.guild.members.fetch(user.id)
    return member.roles.add([rulesRole, memberRole])
})

client.login(token)
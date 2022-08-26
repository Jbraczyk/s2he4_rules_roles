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

    const members = await message.guild.members.fetch()
    const member = await members.find(m => m.id === message.author.id)
    const isAdmin = member._roles.includes(adminRole)
    if (!isAdmin) return message.channel.send(`Tu ne possèdes pas l'accès à cette commande!`)
    await members.forEach(m => m.roles.add('1012540178981736457'))
    return message.channel.send(`Role ajouté à tous les membres!`)
})

client.on('messageReactionAdd', async (reaction, user) => {
    const message = reaction.message

    if (message.id !== rulesMessageId) return
    if (reaction.emoji.name !== rulesEmoji) return reaction.remove()

    const member = await message.guild.members.fetch(user.id)
    return member.roles.add([rulesRole, memberRole])
})

client.login(token)
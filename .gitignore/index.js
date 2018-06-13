const Discord = require('discord.js')
const bot = new Discord.Client()
const Google = require('./commands/google')
const Ping = require('./commands/ping')
const Help = require('./commands/help')
const Tirage = require('./commands/tirage')


bot.on('message', function (message){
	let commandUsed = 
	Google.parse(message) ||
	Ping.parse(message) ||
	Help.parse(message) ||
	Tirage.parse(message) 
	
})





// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`${member} viens d'arriver sur le serveur !\r\nBienvenue a toi ${member}`);
});




bot.login('NDU2MjAxNDcxMzA2ODkxMjc0.DgHGUA.FagxlQPHEU9DIhHsQwczFjywz0M')
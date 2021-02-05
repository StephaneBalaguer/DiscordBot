const Command = require('./command')


module.exports = class help extends Command {
	
	
	static match (message)
	{
		return message.content.startsWith('!aide')
	}
	
	static action (message) 
	{
			message.reply('Alors comment je marche, c\'est simple :\r\n !register @MentionDunUser channelId nouveau nom\r\nah ouais et max length d\'un nick discord : 32 character\r\n ensuite il faut noter que pour avoir le channel id il faut activer le mode dev ( Parametre-Apparence-Activer le mode dev ) et clique droit sur le channel vocal - copier l\'identifiant\r\nSi vous ne souhaitez pas activer le mode dev ou autre vous pouvez soit demander a quelqu\'un l\'ID soit aller insulter discord sur leur site officiel afin qu\'ils ajoutent la fonctionnalité de mention de channel vocaux comme deja demander \r\n D\'ailleurs la mention de chan vocal existe deja il suffit de faire <#ChannelId> pour en mentionner un mais encore il faut le channelId\r\nAh ouais au fait je ne peut pas changer le nick du proprio du serv donc si tu es proprio et souhaites m\'utiliser soit tu transfert le serv a un dummy account soit tu n\'as pas le droit de jouer :) \r\nAide : !aide')
		message.delete()
		
	}
}
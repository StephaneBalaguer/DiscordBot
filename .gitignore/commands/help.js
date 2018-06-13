const Command = require('./command')


module.exports = class help extends Command {
	
	
	static match (message)
	{
		return message.content.startsWith('!aide')
	}
	
	static action (message) 
	{
			message.reply('Liste des fonctions disponibles :\r\nLancer des dés : !lancer xdy avec x le nombre de lancer (1-10) et y le nombre de faces (6-8-10-12-20-100)\r\nRecherche google : !google[recherche]\r\nAide : !aide')
		message.delete()
		
	}
}
const Command = require('./command')

module.exports = class Tirage extends Command{
	
	static match(message){
		return message.content.startsWith('!lance')
	}
	static action (message)
	{
		var msg = message.content
		var tab = msg.substr(7,10).split('d')
		var nblancer = tab[0]
		var nbface = tab[1]
		var retour = "Resultat : "
		console.log(msg)
		console.log(tab)
		console.log(nblancer)
		console.log(nbface)
		if(tab.length > 2)
		{return false}
		
		else{
			if ((nblancer>0 && nblancer<11) && (nbface==6 || nbface==8 || nbface==10 || nbface==12 || nbface==20 || nbface==100))
			{
				console.log('OK')
				var i
				for(i=0;i<nblancer;i++)
				{			if(i!=0){retour+=','}
					var result = Math.floor(Math.random() * Math.floor(nbface))+1
					retour += result + " " 		
				}
				
			}
			else
			{
				console.log("Non Valide")
				retour = "Parametres non valide"
			}
		}
		message.reply(retour)
		
	}
}
require('dotenv').config();
const Discord = require('discord.js')
const bot = new Discord.Client()
const Ping = require('./commands/ping')
const Help = require('./commands/help')
const sqlite3 = require('sqlite3').verbose();

bot.on('message', function (message) {
  let commandUsed =
    Ping.parse(message) ||
    Help.parse(message)
})

let db = new sqlite3.Database('./db/storedNickDb.db');

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
//  let oldUserChannel = oldMember.voiceChannel;
  let userId = newMember.user.id;
  let channelId = newMember.voiceChannelID;
  let ownerID = newMember.guild.ownerID
  if (newUserChannel !== undefined && userId != ownerID) {
    // User Joins a voice channel
    let sql = "SELECT nick from T_savedNick WHERE userId = " + userId + " AND channelId= " + channelId + ";"
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      if (rows.length < 1) {
        return;
      } else {
        newMember.setNickname(unescape(rows[0].nick));
      }
    });
  }
})

const prefix = "!";

bot.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  if (args.shift().toLowerCase() == 'register') {

    if (args.length < 3) {
      message.reply('Invalid command, missing argument. proper use : register USERMENTION CHANNELID NEWNICK');
      return;
    }

    let userId = retrieveUserIdFromMention(args[0]);
    let channelId = args[1];
    let newNick = args[2];
    
    for (let i = 3; i < args.length; i++) {
      newNick = newNick + " " + args[i];
    }
    if (newNick.length > 32) {
      message.reply('New nick max length : 32 ');
      return;
    }
    newNick = escape(newNick);
    let selectCountSql = "SELECT count(*) as total from T_savedNick where userId = ? AND channelId = ?;"
    let dataCountSql = [userId, channelId];
    db.all(selectCountSql, dataCountSql, (err, rows) => {
      if (err) {
        throw err;
      }
      if (rows[0].total == 1) {
          
        let updateData = [newNick, userId, channelId];
        let updateSql = "UPDATE T_savedNick SET nick = ?  WHERE userId = ? AND channelId = ?;"

        db.run(updateSql, updateData, function (err) {
          if (err) {
            return console.log(err.message);
          }
            if(this.changes == 1){
              message.reply("Le nom de <@"+userId+"> sur le chan <#"+channelId+"> sera maintenant " + unescape(newNick));
            }

        });
      }
      else {
        let insertData = [userId, channelId, newNick];
        let insertSql = "INSERT INTO T_savedNick (userId, channelId, nick) values ( ? , ?, ?);"
        db.run(insertSql, insertData, function (err) {
          if (err) {
            return console.log(err.message);
          }
          
          if(this.changes == 1){
            message.reply("Le nom de <@"+userId+"> sur le chan <#"+channelId+"> sera maintenant " + unescape(newNick));
          }
        });
      }
    });

  }
});

function retrieveUserIdFromMention(mention) {
  mention = mention.replace("<", "")
  mention = mention.replace(">", "")
  mention = mention.replace("@", "")
  mention = mention.replace("!", "")
  return mention;
}
console.log("start");
bot.login(process.env.BOT_TOKEN);


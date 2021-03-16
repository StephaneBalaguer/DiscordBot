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
          if (this.changes == 1) {
            message.reply("Le nom de <@" + userId + "> sur le chan <#" + channelId + "> sera maintenant " + unescape(newNick));
          }

        });
      } else {
        let insertData = [userId, channelId, newNick];
        let insertSql = "INSERT INTO T_savedNick (userId, channelId, nick) values ( ? , ?, ?);"
        db.run(insertSql, insertData, function (err) {
          if (err) {
            return console.log(err.message);
          }
          if (this.changes == 1) {
            message.reply("Le nom de <@" + userId + "> sur le chan <#" + channelId + "> sera maintenant " + unescape(newNick));
          }
        });
      }
    });

  }
  let bbs = message.content.slice(prefix.length).trim().split(' ');
  if (bbs.shift().toLowerCase() == 'sendmessage') {
    var abc = message.content.substring(13, message.content.length);
    message.delete();
    message.channel.send(abc);
  }

  let node = message.content.slice(prefix.length).trim().split(' ');
  if (node.shift().toLowerCase() == 'list') {
    var data = '';
    var selectAll;
    if (node.length == 1) {
      data = retrieveUserIdFromMention(args[0]);
      selectAll = "SELECT * from T_savedNick WHERE userId = '" + data + "' ORDER BY channelId;"

    } else {
      selectAll = "SELECT * from T_savedNick ORDER BY channelId;"
    }
    db.all(selectAll, (err, rows) => {
      var out = "Voici la liste des nicks enregistés :"
      var count = 0;
      if (err) {
        throw err;
      }
      let voiceChannelsList = [];
      message.guild.channels.forEach(function (a, b) {
        if (a.type == "voice") {
          voiceChannelsList.push(a.id);
        }
      });
      const pro1 = new Promise((resolve, reject) => {
        rows.forEach(function (a, b) {
          if (voiceChannelsList.includes(a.channelId)) {
            count++;
            out += "\r\n"
            out += "Le nom de <@" + a.userId + "> sur le chan <#" + a.channelId + "> est `" + unescape(a.nick) + "`";
          }
        });
        resolve(out);
      });
      pro1.then((value) => {
        message.delete();
        if (count > 0) {
          message.channel.send(out, {
            split: true
          });
        } else {
          message.channel.send("Aucune correspondance trouvée !");
        }
      })

      pro1.catch((value) => {
        console.log(value);
      })
    })
  };
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
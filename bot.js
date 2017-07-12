const Discord = require('discord.js');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());
const bot = new Discord.Client();

const config = require("./config.json");
const dataf = low('data.json', {
  storage: fileAsync
});
let uarv = dataf.get('users').value();
let uar = dataf.get('users');

var modRoles = ["Familia"];
var i = 0;

function tcalc(seconds){
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = Math.round(((seconds % 86400) % 3600) % 60);
	return numdays + "d " + numhours + "h " + numminutes + "m " + numseconds + "s";
}

function getMemberRoles(array) {
    return array.map(function(item) { return item["name"]; });
}

function hasRole(member, role){
  for(var i = 0;i<=role.length;i++){
    if(getMemberRoles(member.roles).includes(role[i])){
      return true;
    }
  }
  return false;
}

bot.on("guildMemberAdd", (member) => { //memsagem quando alguem novo entra no servidor
    let guild = member.guild;
    console.log(`${member.user.username} juntou-se a ${guild.name}`);
});

bot.on('message', message => {
  if (message.author.bot) return;
  dataf.get('users').find({uID:message.author.id}).assign({lastMessage:message.content}).write();
  dataf.get('users').find({uID:message.author.id}).assign({lastAcivity:Date.now()}).write();
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);
  let argc = args.length;

  //ping-pong
  if (command == "ping"){
    message.channel.sendMessage('PONG!');
  }
  //diz o que aparece depois do say e apaga a mensagem original
  if(command == "say"){
    if(hasRole(message.member,modRoles)){
      if (args.length > 0){
        message.delete();
        message.channel.sendMessage(args.join(" "));
      } else {
        message.reply('`.say [args]`, seu burro!');
      }
    } else {
      message.reply('Não tens permição para fazer este comando!');
    }
  }
  //apaga x memsagens
  if(command == "del"){
    if(hasRole(message.member,modRoles)){
      if (argc < 3){
        var msgs;
        if(argc == 0){
          msgs = 2;
        } else {
          msgs = parseInt(args[0]) + 1;
        }
        message.channel.fetchMessages({limit: msgs}).then(message.channel.bulkDelete(msgs));
      }
    } else {
      message.reply('Não tens permição para fazer este comando!');
    }
  }
  //muda o nick proprio ou de @pessoa
  if(command == "nick"){
    if (argc > 0){
      if(message.guild.member(message.mentions.users.first()) != null){
        if(hasRole(message.member,modRoles)){
          let newNick = message.content.split(" ").slice(2).join(" ");
          message.guild.member(message.mentions.users.first()).setNickname(newNick);
          message.reply(`Nick de **${message.mentions.users.first().username}** alterado!`);
        } else {
          message.reply('Não tens permição para alterar o nome de outras pessoas!');
        }
      } else {
        message.member.setNickname(args.join(" "));
        message.reply('Nickname alterado!');
      }
    } else {
      message.reply('`.nick <nome>`, seu burro!!');
    }
  }
  //muda o jogo actual do bot
  if(command == "game"){
    if(hasRole(message.member,modRoles)){
      if (argc > 0){
        if(argc == 1){
          if(args[0] == 'none'){
            message.client.user.setGame();
          } else {
            message.client.user.setGame(args.join(" "));
          }
        } else {
          message.client.user.setGame(args.join(" "));
        }
      } else {
        message.reply('`.game <texto>`, seu burro!!');
      }
    } else {
      message.reply('Não tens permição para fazer este comando!');
    }
  }
  //mostra o que os comando fazem e cenas
  if (command == "help"){
    message.reply('\n\
                  `.ping` responde PONG \n\
                  `.say <frase>` faz com que o bot diga <frase> \n\
                  `.del x` manda apagar x linhas de texto \n\
                  `.nick <nome>` **OU** `.nick @alguem <nome>` permite alterar o teu nick ou de outra pessoa \n\
                  `.game <x>` faz o bot mostrar que está a jogar <x> \n\
                  `.roll <numero>` atira um dado de valor X e ve o que sai\n\
				  `.whois @pessoa` mostra informação sobre determinada pessoa\n\
				  `.info` @pessoa info sobre a pessoa\n\
                  `.help` este comando, seu burro! ');
  }
  //roll dice
  if (command == "roll"){
    if(argc === 1){
      let rndNum = random.integer(1, parseInt(args[0]));
      message.channel.sendMessage(`lançaste o dado e saiu..... **${rndNum}**!`);
    } else {
      message.reply('`.roll <numero>`, seu burro!');
    }
  }

  if (command == "whois"){
    if(argc > 0){
		if(message.guild.member(message.mentions.users.first()) != null){
			if(message.mentions.users.first().id === '163687401787621376'){ // user ZMiguel
				message.reply('Ele é um gajo espetacular!!!');
			}
			if(message.mentions.users.first().id === '285569324851265537'){ // user jOliveira
				message.reply('Ouvi dizer que o podes encontrar a perseguir freiras em fermentelos...');
			}
			if(message.mentions.users.first().id === '194367861425307649'){ // user Strokes
				message.reply('nunca ouvi falar essa pessoa...');
			}
			if(message.mentions.users.first().id === '147010139503853568'){ // user Tomas
				message.reply('Um bêbado qualquer a viver no sul do país... acho eu...');
			}
			if(message.mentions.users.first().id === '300380716800147467'){ // user aluc
				message.reply('Dizem que ele é muito violento...');
			}
        } else {
          message.reply('tens de fazer @<pessoa>!!');
        }
    } else {
      message.reply('`.whois @pessoa`, seu burro!');
    }
  }

  if (command == "info"){
	  if(argc === 1){
		if(message.guild.member(message.mentions.users.first()) != null){
			let msgu = message.mentions.users.first();
			let nuser = uar.find({uID:msgu.id});
			let nuserv = uar.find({uID:msgu.id}).value();
			let timestamp = Date.now();
			let timedif = timestamp - nuserv.lastTimeStamp;

			if(nuserv.lastStatus === "online"){
				nuser.assign({Ton:nuserv.Ton+timedif}).write();
			}else if(nuserv.lastStatus === "idle"){
				nuser.assign({Tafk:nuserv.Tafk+timedif}).write();
			}else if(nuserv.lastStatus === "dnd"){
				nuser.assign({Tdnd:nuserv.Tndn+timedif}).write();
			}else if(nuserv.lastStatus === "offline"){
				nuser.assign({Toff:nuserv.Toff+timedif}).write();
			}
			nuser.assign({lastTimeStamp:timestamp}).write();

			const embed = new Discord.RichEmbed()
				.setTitle(`Informação sobre ${msgu.username}`)
				.setDescription("Tempos de estados, ultima mensagem, etc...")
				.setThumbnail(msgu.avatarURL)
				.setFooter("Made by ZMiguel", "https://scontent.flis1-1.fna.fbcdn.net/v/t31.0-8/18451397_10207572680909774_2458040368852190353_o.jpg?oh=41e784b6dd3ecbe322e71f7826fac328&oe=5A0087D8")
				.setColor(0xFF0000)
				.addField("Time Online", tcalc(nuserv.Ton/1000), true)
				.addField("Time Idle", tcalc(nuserv.Tafk/1000), true)
				.addField("Time Offline", tcalc(nuserv.Toff/1000), true)
				.addField("Time Do Not Disturb", tcalc(nuserv.Tdnd/1000), true)
				.addField("Ultima mensagem", nuserv.lastMessage)
				.addField("Ultima actividade", Date(nuserv.lastAcivity))
			message.channel.send({embed});

		} else {
			message.reply('tens de fazer @<pessoa>!!');
		}
	  } else {
		  message.reply('`.info @pessoa`, seu burro!');
	  }
  }
});

bot.on('presenceUpdate',(oldMember, newMember) => {
	let userID = newMember.user.id;
	let guildID = newMember.guild.id;
	let timestamp = Date.now();
	let timeseconds = timestamp / 1000;
	if(guildID === uarv[0].sID){
		nuser = uar.find({uID:userID});
		nuserv = uar.find({uID:userID}).value();
		console.log(`>> ${newMember.user.username} changed status from ${oldMember.user.presence.status} to ${newMember.user.presence.status}`);
		let timedif = timestamp - nuserv.lastTimeStamp;

		if(nuserv.lastStatus === "online"){
			nuser.assign({Ton:nuserv.Ton+timedif}).write();
		}else if(nuserv.lastStatus === "idle"){
			nuser.assign({Tafk:nuserv.Tafk+timedif}).write();
		}else if(nuserv.lastStatus === "dnd"){
			nuser.assign({Tdnd:nuserv.Tndn+timedif}).write();
		}else if(nuserv.lastStatus === "offline"){
			nuser.assign({Toff:nuserv.Toff+timedif}).write();
		}
		nuser.assign({lastStatus:newMember.presence.status}).write();
		nuser.assign({lastTimeStamp:timestamp}).write();
		nuser.assign({lastAcivity:Date.now()}).write();

	}
});

bot.on("channelCreate", (channel) => { //quando novo canal é criado
	let familia = channel.client.guilds.array()[1];
	if(channel.type === "text"){
		familia.defaultChannel.sendMessage(`@everyone, novo canal ${familia.channels.array()[familia.channels.array().length-1]} criado!`);
	}
});

bot.on('ready', () => {
  bot.user.setGame('com a tua mãe');
  console.log('Online!!');
});

bot.login(config.token);

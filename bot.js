const Discord = require('discord.js');
const fs = require('fs')
const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());
const bot = new Discord.Client();

const config = require("./config.json");
const datafile = './data.json';

var modRoles = ["Familia"];

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

});

bot.on('ready', () => {
  bot.user.setGame('com a tua mãe');
  console.log('Online!!');
});

bot.login(config.token);

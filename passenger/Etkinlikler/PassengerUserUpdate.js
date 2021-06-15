const { GuildMember, MessageEmbed,Client,WebhookClient} = require("discord.js");
const qDb = require("quick.db");
const db = new qDb.table("ayarlar");
const moment = require('moment');
const cezaDb = new qDb.table("aCezalar");
const passenger = client.veri
module.exports = {
    Etkinlik: "userUpdate",
    /**
     * @param {Client} client
    */
    onLoad: function (client) {
       
    },

    /**
    * @param {User} oldMember
    * @param {User} newMember
    */
    onRequest: async function (oldUser, newUser) {
        if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
        let client = oldUser.client;
        let guild = client.guilds.cache.get(client.sistem.a_sunucuId);
        if(!guild) return console.error(`Hata: ${__filename} Sunucu bulunamadı!`);
        let user = guild.members.cache.get(oldUser.id);
        let ayarlar = client.veri
        let yasakTaglilar = cezaDb.get('yasakTaglilar') || [];
        let log = client.channels.cache.get(passenger.Kanallar.tagLogKanali);
        const embed = new MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({dynamic: true})).setFooter(client.altbaslik).setColor('0x2F3236');
        if ((ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (passenger.Roller.yasakliTagRolu && !user.roles.cache.has(passenger.Roller.yasakliTagRolu))) {
          user.roles.set(user.roles.cache.has(passenger.Roller.boosterRolu) ? [passenger.Roller.boosterRolu, passenger.Roller.yasakliTagRolu] : [passenger.Roller.yasakliTagRolu]).catch();
          user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birini kullanıcı adına aldığın için jaile atıldın! Tagı geri bıraktığında jailden çıkacaksın.`).catch();
          if(!yasakTaglilar.some(x => x.includes(newUser.id))) cezaDb.push('yasakTaglilar', `y${newUser.id}`);
          return;
        };
        if ((ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (passenger.Roller.yasakliTagRoluu && user.roles.cache.has(passenger.Roller.yasakliTagRolu)) && yasakTaglilar.some(x => x.includes(newUser.id))) {
          user.roles.set(passenger.kayıtRolleri.kayıtsızRolleri).catch();
          user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birine sahip olduğun için jaildeydin ve şimdi bu yasaklı tagı çıkardığın için jailden çıkarıldın!`).catch();
          cezaDb.set('yasakTaglilar', yasakTaglilar.filter(x => !x.includes(newUser.id)));
          return;
        };


        //Tag Çıkardı Ekledi (Checkleyip Rol verme İsim Ayarlama İşlemi)
        if(newUser.username.includes(passenger.Tag) && !user.roles.cache.has(passenger.kayıtRolleri.tagRolu)){
             user.roles.add(passenger.kayıtRolleri.tagRolu).catch();
             if(user.manageable) user.setNickname(user.displayName.replace(passenger.IkinciTag, passenger.Tag)).catch();
             log.send(embed.setColor('GREEN').setDescription(`Heyy! ${user} kişisi ismine \`${passenger.Tag}\` tagı alarak ailemize katıldı!`)).catch();
       } else if(!newUser.username.includes(passenger.Tag) && user.roles.cache.has(passenger.kayıtRolleri.tagRolu)){
             user.roles.remove(passenger.kayıtRolleri.tagRolu).catch();
             log.send(embed.setColor('RED').setDescription(`${user} kişisi isminden \`${passenger.Tag}\` tagı çıkararak ailemizden ayrıldı!`)).catch();
        }
    }
  };
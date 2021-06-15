const { GuildMember, MessageEmbed,Client} = require("discord.js");
const qDb = require("quick.db");
const cezaDb = new qDb.table("aCezalar");
const cezaNoDb = new qDb.table("aVeri");
const kDb = new qDb.table("aKullanici");
const moment = require('moment');
const ms = require('ms');
const passenger = client.veri;
module.exports = {
    Isim: "unmute",
    Komut: ["susturmakaldır"],
    Kullanim: "susturmakaldır @Passenger/ID",
    Aciklama: "Belirlenen üyeyi ses veya metin kanallarında ki susturmalarını kaldırır.",
    Kategori: "Yetkili Komutları",
    TekSunucu: true,
  /**
   * @param {Client} client 
   */
  onLoad: function (client) {
  },
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    let unmuteicon = client.emojis.cache.get(passenger.Emojiler.susturmakaldirildi)
    let embed = new MessageEmbed().setColor('0x2f3136').setAuthor(passenger.Tag + " " + passenger.sunucuIsmi, message.guild.iconURL({dynamic: true, size: 2048})).setFooter(client.altbaslik).setTimestamp()
    if(!passenger.Roller.muteHammer || !passenger.Roller.muteHammer) return message.channel.send("Sistemsel hata: Rol bulunamadı veya rol bilgileri girilemedi.").then(sil => sil.delete({timeout: 5000}));
    if(!passenger.Roller.muteHammer.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Hata: Bu komutunu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}unmute @Passenger/ID\``).then(sil => sil.delete({timeout: 5000}));
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(`Hata: Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`).then(sil => sil.delete({timeout: 5000}));
    let muteler = cezaDb.get(`susturulma`) || [];
    let sesmuteler = cezaDb.get(`sessusturulma`) || [];
    let kalicimuteler = cezaDb.get(`kalicisusturma`) || [];
    uye.roles.remove(passenger.Roller.muteRolu).catch();
    if (muteler.some(j => j.id === uye.id)) cezaDb.set(`susturulma`, muteler.filter(x => x.id !== uye.id));
    if (sesmuteler.some(j => j.id === uye.id)) cezaDb.set(`sessusturulma`, sesmuteler.filter(x => x.id !== uye.id));
    if (kalicimuteler.some(j => j.id === uye.id)) cezaDb.set(`kalicisusturma`, kalicimuteler.filter(x => x.id !== uye.id));
    kDb.set(`ceza.${muteler.No}.BitisZaman`, Date.now());
    kDb.set(`ceza.${sesmuteler.No}.BitisZaman`, Date.now());
    if (uye.voice.channel) uye.voice.setMute(false);
    message.channel.send(`${unmuteicon} ${uye} (\`${uye.id}\`), üyesinin ses ve metin kanallarında ki susturulması __kaldırıldı__.`).catch().then(x => x.delete({timeout: 5000}));
    if(passenger.Kanallar.muteLogKanali && client.channels.cache.has(passenger.Kanallar.muteLogKanali)) client.channels.cache.get(passenger.Kanallar.muteLogKanali).send(embed.setDescription(`${uye} (\`${uye.id}\`), adlı üyenin ${message.author} (\`${message.author.id}\`), tarafından ses ve metin kanallarından susturulması kaldırıldı!`)).catch();
      message.react("✅")
   }
};


const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const db = require("quick.db");
const kullaniciverisi = new db.table("aKullanici");
const passenger = client.veri.kayıtRolleri;
const passengerveri = client.veri;
module.exports = {
    Isim: "isimler",
    Komut: ["isimsorgu"],
    Kullanim: "isimsorgu @Passenger/ID",
    Aciklama: "Belirlenen üyenin önceki isim ve yaşlarını gösterir.",
    Kategori: "Kayıt Komutları",
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
    let embed = new MessageEmbed().setColor('0x2f3136').setFooter(client.altbaslik).setThumbnail(passengerveri.embedUfakResim)
    if((!passenger.erkekRolleri && !passenger.kadinRolleri) || !passenger.kayıtYapanRoller) return message.channel.send("Sistemsel hata: Rol bulunamadı veya rol bilgileri girilemedi.").then(sil => sil.delete({timeout: 5000}));
    if(!passenger.kayıtYapanRoller.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}isimsorgu @Passenger/ID\``).then(sil => sil.delete({timeout: 5000}));
    let isimsorgu = kullaniciverisi.get(`k.${uye.id}.isimler`) || [];
   let Liste = isimsorgu.length || `0`;
  isimsorgu = isimsorgu.reverse();
  let IsimGecmisi;
  IsimGecmisi = isimsorgu.length > 0 ? isimsorgu.map((value, index) => `\`${value.Isim}\``).join("\n") : "Üyenin herhangi bir kayıtı bulunamadı.";
    message.channel.send(embed.setAuthor(uye.displayName, uye.user.avatarURL({dynamic: true})).setDescription(`\n**Bu Kullanıcının Geçmiş İsimleri [${Liste}]**\n${IsimGecmisi}`));
    }
};

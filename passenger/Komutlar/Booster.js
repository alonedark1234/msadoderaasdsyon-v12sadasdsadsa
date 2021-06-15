const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const db = require("quick.db");
const moment = require('moment');
require('moment-duration-format');
const passenger = client.veri
module.exports = {
    Isim: "booster",
    Komut: ["zengin"],
    Kullanim: "zengin <belirlenen isim>",
    Aciklama: "Sunucuya takviye atan üyeler bu komut ile isim değişimi yapar.",
    Kategori: "Booster",
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
  onRequest: async (client, message, args) => {
      if (!passenger.Roller.boosterRolu)
          return message.channel.send(`Sistemsel hata: Rol bulunamadı veya rol bilgileri girilemedi.`).then(x => x.delete({timeout: 5000}));
      if (!message.member.roles.cache.has(passenger.Roller.boosterRolu) && !message.member.hasPermission('ADMINISTRATOR'))
          return message.channel.send(`Hata: Sunucuya takviye atmadığın için bu komutu kullanmaya hak sahibi değilsin.`).then(x => x.delete({ timeout: 5000 }));
      let uye = message.guild.member(message.author);
      let yazilacakIsim;
      let isim = args.join(' ');
      if (!isim)
          return message.channel.send(`Hata: Lütfen bir isim belirleyiniz!  __Örn:__  \`${client.sistem.a_Prefix}zengin <Belirlenen Isim> Max: 32 Karakter!\``).then(x => x.delete({ timeout: 5000 }));
      yazilacakIsim = `${uye.user.username.includes(passenger.Tag) ? passenger.Tag : (passenger.ikinciTag ? passenger.ikinciTag : (passenger.Tag || ""))} ${isim}`;
      if(uye.manageable) uye.setNickname(`${yazilacakIsim}`).catch();
      message.channel.send(new MessageEmbed().setFooter(client.altbaslik).setColor("0x2F3236").setTitle(passenger.sunucuUfakIsim + " Booster Sistemi").setThumbnail(uye.user.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${client.emoji(passenger.Emojiler.tag)} Yeni İsim: \`${yazilacakIsim}\`\n${client.emoji(passenger.Emojiler.Onay)} Başarıyla isminizi değiştirdiniz!\nYeni isminizle havanıza hava katın!`)).catch();
      message.react("✅")
  }
};
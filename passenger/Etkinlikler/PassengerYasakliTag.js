const { GuildMember, MessageEmbed,Client} = require("discord.js");
const qDb = require("quick.db");
const db = new qDb.table("ayarlar");
const cezaDb = new qDb.table("aCezalar");
const kullaniciverisi = new qDb.table("aKullanici");
const moment = require('moment');
module.exports = {
    Etkinlik: "ready",
    /**
     * @param {Client} client
     */
    onLoad: function (client) {
       
    },
    /**
     * @param {GuildMember} member
     */
    onRequest: async function () {
        setInterval(() => {
            yasakliTagKontrolEt();
          }, 10000);
    }
  };

  function yasakliTagKontrolEt() {
    let passenger = client.veri;
    let passengerveri = client.veri
    let sid = client.sistem.a_sunucuId;
    
    // Yasaklı tag tarama (Yasaklı Tag Checkleme)
    let yasakTaglar = passengerveri.yasakTaglar || [];
    let yasakTaglilar = cezaDb.get("yasakTaglilar") || [];
  for (let kisi of yasakTaglilar) {
    let uye = client.guilds.cache.get(sid).members.cache.get(kisi.slice(1));
    if (uye && yasakTaglar.some(tag => uye.user.username.includes(tag)) && !uye.roles.cache.has(passenger.Roller.yasakliTagRolu)) uye.roles.set(uye.roles.cache.has(passenger.Roller.boosterRolu) ? [passenger.Roller.boosterRolu, passenger.Roller.yasakliTagRolu] : [passenger.Roller.yasakliTagRolu]).catch();
    if (uye && !yasakTaglar.some(tag => uye.user.username.includes(tag)) && uye.roles.cache.has(passenger.Roller.yasakliTagRolu)) {
      cezaDb.set("yasakTaglilar", yasakTaglilar.filter(x => !x.includes(uye.id)));
      uye.roles.set(passenger.kayıtRolleri.kayıtsızRolleri).catch();
      if(passenger.IkinciTag) uye.setNickname(`${passenger.IkinciTag} İsim | Yaş`).catch();
      else if(passenger.Tag) uye.setNickname(`${passenger.Tag} İsim | Yaş`).catch();
    };
  };
  };
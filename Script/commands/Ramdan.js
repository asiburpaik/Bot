
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {

  // command info
  name: "ramadan",
  version: "1.0",
  creator: "Islamick Cyber",
  countDown: 5,
  hasPermission: 0,
  commandCategory: "Religion",
  description: "Show Ramadan Sehri & Iftar time",
  guide: { en: "{pn} city/state" },


  // main function
  run: async function ({ message, args, event }) {

    // ❌ city না দিলে
    if (!args.length) {
      return message.reply("West Bengal/Kolkata.");
    }

    try {

      const city = args.join(" ");
      const botName = "Halal Fox";

      message.reaction("⏰", event.messageID);

      // API call
      const res = await axios.get(
        `https://connect-foxapi.onrender.com/tools/ramadan?city=${encodeURIComponent(city)}&botName=${botName}`
      );

      const data = res.data;

      if (!data.city) {
        return message.reply("City paoa jay nai.");
      }


      // text message
      const text =
`🌙 Ramadan Timings 🕌

City: ${data.city}
Date: ${data.today.date}
Hijri: ${data.hijriDate}
Time Now: ${data.localTime}

Today:
Sehri: ${data.today.sahr}
Iftar: ${data.today.iftar}

Tomorrow:
Sehri: ${data.tomorrow.sahr}
Iftar: ${data.tomorrow.iftar}`;


      let attachment = null;

      // image থাকলে download
      if (data.canvas_img) {
        const filePath = path.join(__dirname, "ramadan.png");

        const img = await axios.get(data.canvas_img, {
          responseType: "arraybuffer"
        });

        fs.writeFileSync(filePath, img.data);
        attachment = fs.createReadStream(filePath);
      }


      // reply
      await message.reply({
        body: text,
        attachment
      });

      message.reaction("✅", event.messageID);

    } catch (err) {
      console.log(err);
      message.reply("Error hoise. City check koro.");
    }
  }
};

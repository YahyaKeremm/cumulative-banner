const discord = require('discord.js');
const tmi = require('tmi.js');
const settings = require('./settings.json');

const banChanId = 0; //komutların çalıştırılacağı discord kanalının idsi (0dan kendi kanalınıza göre değiştirin)
const channelList = [
    //botun belirtilen kişiyi banlayacağı kanalların listesi:
    //e.g "yahyakeremm", "siryakup", "karinca", "pesimistyle", "pizzavenk"

];

const dClient = new discord.Client();
const tClient = tmi.client({identity: {
    username: settings.twitch.username,
    password: settings.twitch.password
}, channels: channelList});

dClient.on('message', (msg) => {
    let content = msg.content;
    let splitted = content.split(" ");
    if (msg.channel.id == banChanId && content.startsWith("!ban ") && splitted.length >= 2) {
        let personToBan = splitted[1];
        let reason = "";
        if (splitted.length > 2) {
            let temp_ = splitted;
            temp_.splice(0, 2);
            reason = temp_.join(" ");
        }
        let chan = msg.channel;

        channelList.forEach(element => {
            tClient.ban(element, personToBan, reason)
            .then((data) => {
                if (data.length === 3)
                {
                    let strToSend = `Tamam! \`${data[1]}\` nickli şahısı${reason ? ` \`${reason}\` sebebiyle` : ""} \`${data[0].substring(1)}\` kanalından banladım.\n`;
                    setTimeout(() => {
                        chan.send(strToSend);
                    }, 1000);
                }
            }).catch((err) => {
                if (err == "already_banned") {
                    let strToSend = `Olmadı! \`${personToBan}\` nickli şahıs \`${element.substring(1)}\` kanalından zaten banlı.`;
                    setTimeout(() => {
                        chan.send(strToSend);
                    }, 1000);
                }
            });
        });
    }

    if (msg.channel.id == banChanId && content.startsWith("!unban ") && splitted.length === 2) {
        let personToUnban = splitted[1];
        let chan = msg.channel;

        channelList.forEach(element => {
            tClient.unban(element, personToUnban)
            .then((data) => {
                if (data.length === 2) {
                    let strToSend = `Tamam! \`${data[1]}\` nickli şahısın \`${data[0].substring(1)}\` kanalındaki banını kaldırdım.`;
                    setTimeout(() => {
                        chan.send(strToSend);
                    }, 1000);
                }
            }).catch((err) => {
                if (err == "bad_unban_no_ban") {
                    let strToSend = `Olmadı! \`${personToUnban}\` nickli şahıs \`${element.substring(1)}\` kanalından banlı değil.`;
                    setTimeout(() => {
                        chan.send(strToSend);
                    }, 1000);
                }
            });
        });
    }
});

/* START DEBUG PURPOSES */
tClient.on('connected', (addr, port) => {
    console.log(`running on ${addr}:${port}`);
});

dClient.on('ready', () => {
    console.log(`Logged in as ${dClient.user}`);
})
/* END DEBUG PURPOSES */

tClient.connect();
dClient.login(settings.discord.token);
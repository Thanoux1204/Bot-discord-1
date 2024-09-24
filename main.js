const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

const prefix = '/';

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

// for each msg
client.on('message', async message => {
    if(message.content.startsWith(prefix) && !message.author.bot){
        const args = message.content.slice(prefix.length).trim().split(/ +/); 
        const command = args.shift().toLowerCase(); 

        if (command === 'prix') {
            const titre = args.join('-');

            // debug - send message with title
            message.channel.send(`${titre}`);

            const url = `https://www.cheapshark.com/api/1.0/games?title=${titre}&limit=60&exact=0`; //variable

            const embed = new Discord.MessageEmbed()
                .setTitle(`Recherche du jeu '__${titre}__':`)
                .setDescription("Voici les offres les moins chères")
                .setColor(0x51d37a)

            // get data from api
            const response = await fetch(url); 
            const resultat = await response.json();

            for (const element of resultat) {
                const dealID = element.cheapestDealID;
                const url2 = `https://www.cheapshark.com/api/1.0/deals?id=${dealID}`;
                const response2 = await fetch(url2);
                const resultat2 = await response2.json();
                const shopID = resultat2.gameInfo.storeID;
                console.log(shopID);

                const url3 = 'https://www.cheapshark.com/api/1.0/stores';
                const response3 = await fetch(url3);
                const resultat3 = await response3.json();

                for (const element3 of resultat3) {

                    if (element3.storeID === shopID) {
                        const shopName = element3.storeName;
                        console.log(shopName);

                        embed.addField(`> **${element.external}**`, `${element.cheapest}€ sur ${shopName}\n`, false)
                        embed.setThumbnail(resultat[0].thumb)
                        embed.setTimestamp()
                        embed.setFooter("demandé par "+message.author.username, message.author.avatarURL());
                        console.log(element.external, element.cheapest, dealID, shopID, shopName);
                    }
                }
            }

            message.channel.send(embed);
        }
    }
});


const token = process.env.DISCORD_BOT_SECRET;
client.login(token);
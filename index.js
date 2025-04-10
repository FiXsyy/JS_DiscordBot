//  Require discord.js classes, imports some node modules, and gets the Discord Token from config.json
const fs = require('node:fs');          //  used to read the commands directory
const path = require('node:path');      //  helps construct paths to files and directories (works for every os)
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

//  New client instance, setting intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

//  Looks through folders in search for commands and adds them to the commands collection
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }
        else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//  Looks through directory for events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    }
    else{
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
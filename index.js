//  Require for discord.js classes + Discord Token from config.json
const fs = require('node:fs');              //  native file system module - used to read the commands directory
const path = require('node:path');          //  native path utility module - helps construct paths to files and directories (works for every os as well)
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

//  New client instance + attaching the commands to it (so they can be used in other files)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});
client.commands = new Collection();

//  Looks through folders in search for commands + adds them to the commands collection
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

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

//  Executes once at the start of the script
client.once(Events.ClientReady, readyClient => {
    console.log(`Bot succesfully logged in as ${readyClient.user.tag}`);
});

//  Executes on every interaction
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`No command matching ${interaction.commandName} was found.`)
        return;
    }

    try{
        await command.execute(interaction);
    }
    catch(error){
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
        else{
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

client.login(token);
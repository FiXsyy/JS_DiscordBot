const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { argv } = require('node:process');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

//	Same as in index.js AKA goes through all .js files in "commands directory"
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// 	Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		
        // 	The put method is used to fully refresh all commands in the guild (or global) with the current set
		if(argv[argv.length - 1] == 'global'){
			//	for global commands
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
		}
		else{
			//	for guild-based commands
			const data = await rest.put(		
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
		}
	} catch (error) {
		console.error(error);
	}
})();
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const { argv } = require('node:process');

const rest = new REST().setToken(token);

const commandId = argv[2];

if(argv[argv.length - 1] == 'global'){
    // for global commands
    rest.delete(Routes.applicationCommand(clientId, commandId))
        .then(() => console.log('Successfully deleted global application command'))
        .catch(console.error);
}
else{
    // for guild-based commands
    rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
        .then(() => console.log('Successfully deleted guild command'))
        .catch(console.error);
}
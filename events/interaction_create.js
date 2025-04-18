const { Events, Collection, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if(!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command){
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        //  Cooldown mechanism
        const { cooldowns } = interaction.client;

        if(!cooldowns.has(command.data.name)){
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if(timestamps.has(interaction.user.id)){
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if(now < expirationTime){
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                
                return interaction.reply({content: `Please wait, you're on a cooldown for ${command.data.name}.\nYou can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral});
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        //  Executes the command and catches errors if they occur
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
    }
}
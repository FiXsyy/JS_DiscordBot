const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about users or the server.')
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Provides information about the user.')
            .addUserOption(option => option
                .setName('target')
                .setDescription('Targetted user'))
            .addBooleanOption(option => option
                .setName('ephemeral')
                .setDescription('Makes the command only visible to you.')))
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('Provides information about the server.')
            .addBooleanOption(option => option
                .setName('ephemeral')
                .setDescription('Makes the command only visible to you.'))),
    async execute(interaction){
        if(interaction.options.getSubcommand() === 'user'){
            const user = interaction.options.getUser('target');
            const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

            if(!ephemeral){
                if(user){   
                    await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
                }
                else{
                    await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
                }
            }
            else{
                if(user){
                    await interaction.reply({content: `Username: ${user.username}\nID: ${user.id}`, flags: MessageFlags.Ephemeral});
                }
                else{
                    await interaction.reply({content: `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`, flags: MessageFlags.Ephemeral});
                }
            }
        }
        else if(interaction.options.getSubcommand() === 'server'){
            const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

            if(!ephemeral){
                await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
            }
            else{
                await interaction.reply({content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`, flags: MessageFlags.Ephemeral});
            }
        }
    },
};
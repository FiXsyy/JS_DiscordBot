const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.')
        .addIntegerOption(option => option
            .setName('flip_number')
            .setDescription('Number of times you want to flip the coin.')
            .setMinValue(1))
        .addBooleanOption(option => option
            .setName('descriptive')
            .setDescription('Gives more info about the coinflips.')),
    async execute(interaction){
        const flip_number = interaction.options.getInteger('flip_number') ?? 1;
        const descriptive = interaction.options.getBoolean('descriptive') ?? false;
        
        var total_heads = 0;
        var rolls = [];

        if(descriptive){
            if(flip_number == 1){
                await interaction.reply(`Results for 1 Flip\nYou flipped: ${Math.floor(Math.random() * 2) ? 'Heads' : 'Tails'}`);
                return;
            }

            for(let i = 0; i < flip_number; ++i){
                let roll = Math.floor(Math.random() * 2);
                total_heads += roll;
                rolls.push(roll ? 'Heads' : 'Tails');
            }

            await interaction.reply(`Results for ${flip_number} Flips\nYou flipped: ${rolls.map(value => value).join(', ')}\nTotal: ${total_heads} Heads, ${flip_number - total_heads} Tails`);
        }
        else{
            if(flip_number == 1){
                await interaction.reply(`${Math.floor(Math.random() * 2) ? 'Heads' : 'Tails'}`);
                return;
            }

            for(let i = 0; i < flip_number; ++i){
                let roll = Math.floor(Math.random() * 2);
                total_heads += roll;
                rolls.push(roll ? 'Heads' : 'Tails');
            }

            await interaction.reply(`Results for ${flip_number} Flips\nTotal: ${total_heads} Heads, ${flip_number - total_heads} Tails`);
        }
    },
};
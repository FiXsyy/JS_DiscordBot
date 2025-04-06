const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls dice.')
        .addIntegerOption(option => option
            .setName('die_number')
            .setDescription('Number of die you want to throw')
            .setMinValue(1))
        .addIntegerOption(option => option
            .setName('sides_number')
            .setDescription('Number of sides on every die')
            .setMinValue(3)),
    async execute(interaction){
        const die_number = interaction.options.getInteger('die_number') ?? 1;
        const sides_number = interaction.options.getInteger('sides_number') ?? 6;

        var total = 0;
        var rolls = [];

        if(die_number == 1){
            await interaction.reply(`Results for 1D${sides_number}\nYou rolled: ${Math.ceil(Math.random() * sides_number)}`);
            return;
        }

        for(let i = 0; i < die_number; ++i){
            let roll = Math.ceil(Math.random() * sides_number);
            total += roll;
            rolls.push(roll);
        }

        await interaction.reply(`Results for ${die_number}D${sides_number}\nYou rolled: ${rolls.map(value => value).join(', ')}\nTotal: ${total}`)
    },
};
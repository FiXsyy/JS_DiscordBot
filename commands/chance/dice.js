const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { rollImg } = require('../../config.json')

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

        const embed = new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle(`Results for ${die_number}D${sides_number}`)
            .setDescription('something')
            .setThumbnail(rollImg);

        var total = 0;
        var rolls = [];

        if(die_number == 1){
            let newEmbed = EmbedBuilder.from(embed).setDescription(`**You rolled:** ${Math.ceil(Math.random() * sides_number)}`); 
            await interaction.reply({embeds: [newEmbed]});
            return;
        }

        for(let i = 0; i < die_number; ++i){
            let roll = Math.ceil(Math.random() * sides_number);
            total += roll;
            rolls.push(roll);
        }

        let newEmbed = EmbedBuilder.from(embed).setDescription(`**You rolled:**\n${rolls.map(value => value).join(', ')}\n\n**Total:** ${total}`);
        await interaction.reply({embeds: [newEmbed]});
    },
};
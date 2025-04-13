const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { coinImg } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.')
        .addIntegerOption(option => option
            .setName('flip_number')
            .setDescription('Number of times you want to flip the coin.')
            .setMinValue(1)),
    async execute(interaction){
        const flip_number = interaction.options.getInteger('flip_number') ?? 1;
        
        const embed = new EmbedBuilder()
                    .setColor(0xffcc00)
                    .setTitle('Title')
                    .setDescription('Description')
                    .setThumbnail(coinImg);

        var total_heads = 0;
        var rolls = [];

        if(flip_number == 1){
            let newEmbed = EmbedBuilder.from(embed)
                .setTitle('Results for 1 Flip')
                .setDescription(`**You flipped:** ${Math.floor(Math.random() * 2) ? 'Heads' : 'Tails'}`); 
            await interaction.reply({embeds: [newEmbed]});
            return;
        }

        for(let i = 0; i < flip_number; ++i){
            let roll = Math.floor(Math.random() * 2);
            total_heads += roll;
            rolls.push(roll ? 'Heads' : 'Tails');
        }

        let newEmbed = EmbedBuilder.from(embed)
            .setTitle(`Results for ${flip_number} Flips`)
            .setDescription(`**You flipped:**\n${rolls.map(value => value).join(', ')}\n\n**Total:** ${total_heads} Heads, ${flip_number - total_heads} Tails`); 
        await interaction.reply({embeds: [newEmbed]});
    },
};
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { coinImg } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.')
        .addIntegerOption(option => option
            .setName('flip_number')
            .setDescription('Number of times you want to flip the coin.')
            .setMinValue(1)),
    async execute(interaction){
        //  Gives flip_number a value as set in options and gives it a default value if nothing was set
        const flip_number = interaction.options.getInteger('flip_number') ?? 1;
        
        //  Creates a new embed
        const embed = new EmbedBuilder()
            .setColor(0xffcc00)
            .setTitle('Title')
            .setDescription('Description')
            .setThumbnail(coinImg);

        //  If flip_number == 1
        //  Sends a siple embed
        if(flip_number == 1){
            let newEmbed = EmbedBuilder.from(embed)
                .setTitle('Results for 1 Flip')
                .setDescription(`**You flipped:** ${Math.floor(Math.random() * 2) ? 'Heads' : 'Tails'}`); 
            await interaction.reply({embeds: [newEmbed]});
            return;
        }

        //  If flip_number > 1
        //  Creates an info button to attach to the embed
        const info = new ButtonBuilder()
            .setCustomId('info')
            .setLabel('More Info')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(info);

        //  Randomises flips, adds them to rolls and calculates total_heads
        var total_heads = 0;
        var rolls = [];

        for(let i = 0; i < flip_number; ++i){
            let roll = Math.floor(Math.random() * 2);
            total_heads += roll;
            rolls.push(roll ? 'Heads' : 'Tails');
        }

        //  Sends an embed with an attached info button
        let newEmbed = EmbedBuilder.from(embed)
            .setTitle(`Results for ${flip_number} Flips`)
            .setDescription(`**Total:** ${total_heads} Heads, ${flip_number - total_heads} Tails`); 
        const response = await interaction.reply({embeds: [newEmbed], components: [row], withResponse: true});

        //  Awaits button press, then adds more info to embed and hides the button
        const collectionFilter = i => i.user.id === interaction.user.id;
        try{
            const buttonPressed = await response.resource.message.awaitMessageComponent({filter: collectionFilter, time: 60_000});

            if(buttonPressed.customId === 'info'){
                let descriptiveEmbed = EmbedBuilder.from(newEmbed)
                    .setDescription(`**You flipped:**\n${rolls.map(value => value).join(', ')}\n\n**Total:** ${total_heads} Heads, ${flip_number - total_heads} Tails`); 
                await buttonPressed.update({embeds: [descriptiveEmbed], components: []});
            }
        }
        catch{
            await interaction.editReply({components: []});
        }
    },
};
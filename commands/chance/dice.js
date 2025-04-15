const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { rollImg } = require('../../config.json');

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
            .setMinValue(3)
            .setAutocomplete(true)),
    async autocomplete(interaction){
        const focusedValue = interaction.options.getFocused();
        const choices = ['20', '12', '10', '8', '6', '4'];
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(filtered.map(choice => ({name: choice, value: choice})));
    },
    async execute(interaction){
        //  Gives die_number and sides_number values as set in options and gives them default values if nothing was set
        const die_number = interaction.options.getInteger('die_number') ?? 1;
        const sides_number = interaction.options.getInteger('sides_number') ?? 6;

        //  Creates a new embed
        const embed = new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle(`Results for ${die_number}**D**${sides_number}`)
            .setDescription('something')
            .setThumbnail(rollImg);

        //  If die_number == 1
        //  Sends a siple embed
        if(die_number == 1){
            let newEmbed = EmbedBuilder.from(embed).setDescription(`**You rolled:** ${Math.ceil(Math.random() * sides_number)}`); 
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

        //  Randomises rolls, adds them to rolls and adds them to total
        var total = 0;
        var rolls = [];

        for(let i = 0; i < die_number; ++i){
            let roll = Math.ceil(Math.random() * sides_number);
            total += roll;
            rolls.push(roll);
        }

        //  Sends an embed with an attached info button
        let newEmbed = EmbedBuilder.from(embed)
            .setDescription(`**Total:** ${total}`);
        const response = await interaction.reply({embeds: [newEmbed], components: [row], withResponse: true});

        //  Awaits button press, then adds more info to embed and hides the button
        const collectionFilter = i => i.user.id === interaction.user.id;
        try{
            const buttonPressed = await response.resource.message.awaitMessageComponent({filter: collectionFilter, time: 60_000});

            if(buttonPressed.customId === 'info'){
                let descriptiveEmbed = EmbedBuilder.from(newEmbed)
                    .setDescription(`**You rolled:**\n${rolls.map(value => value).join(', ')}\n\n**Total:** ${total}`); 
                await buttonPressed.update({embeds: [descriptiveEmbed], components: []});
            }
        }
        catch{
            await interaction.editReply({components: []});
        }
    },
};
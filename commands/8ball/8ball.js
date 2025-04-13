const { SlashCommandBuilder } = require('discord.js');
const responses = require('./8ball.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the Magic 8 Ball a question.'),

    async execute(interaction){
        await interaction.reply('Ask the Magic 8 Ball your question!');

        const collector = interaction.channel.createMessageCollector({
            filter: (message) => message.author.username === interaction.user.username,
            max: 1,
            time: 60_000
        });

        let answered = false;

        collector.on('collect', (message) => {
            message.reply(`${responses[Math.floor(Math.random() * responses.length)]}`);

            answered = true;
            collector.stop();
        });

        collector.on('end', () => {
            if(!answered){
                interaction.followUp('The Magic 8 Ball cannot answer the void...');
            }
        });
    }
};
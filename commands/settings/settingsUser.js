const { MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
    const userTimezone = interaction.options.getString('timezone');

    console.log(userTimezone);
};
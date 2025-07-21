const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');

module.exports = {
    customId: 'announcementChannelSelect',
    async execute(interaction) {
        await interaction.deferUpdate();
        await interaction.deleteReply();

        const selectedValue = interaction.values[0];

        console.log(selectedValue);
        console.log(typeof selectedValue);
    }
};
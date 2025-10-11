const { MessageFlags } = require('discord.js');
const { editGuildConfiguration } = require('../../database/settings');

module.exports = async (interaction) => {
    const webhookProfileName = interaction.options.getString('announcer_name');
    const webhookProfileUrl = interaction.options.getAttachment('announcer_profile');
    const errorChannel = interaction.options.getChannel('error_channel');

    //TBD
};
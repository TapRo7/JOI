const { MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
};
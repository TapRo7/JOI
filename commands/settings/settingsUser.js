const { MessageFlags } = require('discord.js');
const { editUserConfiguration } = require('../../database/settings');

module.exports = async (interaction) => {
    const userTimezone = interaction.options.getString('timezone');

    await editUserConfiguration(interaction.user.id, userTimezone, true);

    await interaction.editReply({ content: `Your timezone has been set as **${userTimezone}**.\nWhen you schedule announcements in the future, you will select the time in your set timezone.`, flags: MessageFlags.Ephemeral });
};
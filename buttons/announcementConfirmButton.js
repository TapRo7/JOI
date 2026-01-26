const { MessageFlags } = require('discord.js');
const { addAnnouncement } = require('../database/announcements');

async function replyIncompleteSetup(interaction) {
    const replyMessage = await interaction.followUp({ content: 'Please complete the announcement setup first.', flags: MessageFlags.Ephemeral });
    await new Promise(resolve => setTimeout(resolve, 5000));
    await interaction.deleteReply(replyMessage);
}

module.exports = {
    customId: 'announcementConfirmButton',
    async execute(interaction) {
        await interaction.deferUpdate();

        if (interaction.message.embeds.length != 2) {
            return await replyIncompleteSetup(interaction);
        }

        const contentEmbed = interaction.message.embeds[0];
        const announcementContent = contentEmbed.description;

        const setupEmbed = interaction.message.embeds[1];

        let announcementName;
        let announcementId;
        let announcementChannelId;
        let announcementEpochTime;

        for (const field of setupEmbed.fields) {
            if (field.value.toLowerCase().includes('not set')) {
                return await replyIncompleteSetup(interaction);
            }

            if (field.name.includes('Announcement Name')) {
                announcementName = field.value.slice(2);
            }
            else if (field.name.includes('Announcement ID')) {
                announcementId = field.value.slice(2);
            }
            if (field.name.includes('Announcement Channel')) {
                announcementChannelId = field.value.match(/<#(\d+)>/)[1];
            }
            else if (field.name.includes('Announcement Date')) {
                announcementEpochTime = field.value.match(/<t:(\d+):[a-zA-Z]>/)[1];
            }
        }

        if ([announcementName, announcementId, announcementContent, announcementChannelId, announcementEpochTime].some(v => v == null)) {
            return await replyIncompleteSetup(interaction);
        }

        const announcementAdded = await addAnnouncement(
            announcementId,
            interaction.user.id,
            announcementName,
            announcementChannelId,
            interaction.guild.id,
            announcementEpochTime,
            announcementContent
        );

        if (announcementAdded) {
            return await interaction.editReply({ content: 'Your announcement has been scheduled!', embeds: [], components: [] });
        }
        else {
            return await interaction.followup({ content: 'Something went wrong.', flags: MessageFlags.Ephemeral });
        }
    }
};
const { MessageFlags, EmbedBuilder } = require('discord.js');
const { getAnnouncementMedia, setAnnouncementMedia } = require('../utils/cache');

module.exports = {
    customId: 'announcementRemoveMediaModal',
    async execute(interaction) {
        await interaction.deferUpdate();

        const setupMessageEmbeds = interaction.message.embeds;
        const rebuiltEmbeds = setupMessageEmbeds.map(e => EmbedBuilder.from(e));

        let setupEmbed;
        if (rebuiltEmbeds.length == 2) {
            setupEmbed = rebuiltEmbeds[1];
        } else {
            setupEmbed = rebuiltEmbeds[0];
        }

        let announcementId;
        for (const field of setupEmbed.data.fields) {
            if (field.name.includes('Announcement ID')) {
                announcementId = field.value.slice(2);
            }
        }

        const selectedFiles = interaction.fields.getStringSelectValues('announcementRemoveMediaSelect');

        const currentMedia = await getAnnouncementMedia(announcementId);
        const updatedMedia = currentMedia.filter(m => !selectedFiles.includes(m.name));
        const deletedCount = currentMedia.length - updatedMedia.length;

        await setAnnouncementMedia(announcementId, updatedMedia);

        setupEmbed.setFooter({ text: `${updatedMedia.length} Attachments uploaded` });

        await interaction.editReply({ embeds: rebuiltEmbeds });

        const replyMessage = await interaction.followUp({
            content: `Successfully removed ${deletedCount} file(s). ${updatedMedia.length} attachment(s) remaining.`,
            flags: MessageFlags.Ephemeral
        });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};

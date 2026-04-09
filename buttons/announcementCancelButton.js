const { deleteAnnouncementMedia } = require('../utils/cache');

module.exports = {
    customId: 'announcementCancelButton',
    async execute(interaction) {
        await interaction.deferUpdate();

        const embeds = interaction.message.embeds;
        const setupEmbed = embeds.length == 2 ? embeds[1] : embeds[0];

        if (setupEmbed) {
            for (const field of setupEmbed.fields) {
                if (field.name.includes('Announcement ID')) {
                    await deleteAnnouncementMedia(field.value.slice(2));
                    break;
                }
            }
        }

        await interaction.editReply({
            content: 'The announcement has been cancelled.',
            components: []
        });
    }
};

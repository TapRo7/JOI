const { addAnnouncement } = require('../database/announcements');

module.exports = {
    customId: 'announcementConfirmButton',
    async execute(interaction) {
        await interaction.deferUpdate();

        //TBD LOGIC

        await interaction.editReply({ content: 'Your announcement has been scheduled!', embeds: [], components: [] });
    }
};
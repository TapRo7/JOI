module.exports = {
    customId: 'announcementCancelButton',
    async execute(interaction) {
        await interaction.deferUpdate();

        await interaction.editReply({
            content: 'The announcement has been cancelled.',
            components: []
        });
    }
};
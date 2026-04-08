const { MessageFlags, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

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
        const baseDir = path.join(__dirname, '..', 'Attachments', announcementId);

        let deletedCount = 0;
        const errors = [];

        for (const fileName of selectedFiles) {
            const filePath = path.join(baseDir, fileName);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            } catch (error) {
                console.error(`Failed to delete ${fileName}:`, error);
                errors.push(fileName);
            }
        }

        const match = setupEmbed.data.footer.text.match(/\d+/);
        const currentCount = match ? Number(match[0]) : 0;
        const newCount = currentCount - deletedCount;

        setupEmbed.setFooter({ text: `${newCount} Attachments uploaded` });

        await interaction.editReply({ embeds: rebuiltEmbeds });

        const message = errors.length > 0
            ? `Removed ${deletedCount} file(s). Failed to remove: ${errors.join(', ')}`
            : `Successfully removed ${deletedCount} file(s). ${newCount} attachment(s) remaining.`;

        const replyMessage = await interaction.followUp({ content: message, flags: MessageFlags.Ephemeral });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};

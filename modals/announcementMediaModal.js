const { MessageFlags, EmbedBuilder } = require('discord.js');
const { getAnnouncementMedia, setAnnouncementMedia } = require('../utils/cache');

function resolveUniqueName(existingNames, fileName) {
    const lastDot = fileName.lastIndexOf('.');
    const ext = lastDot !== -1 ? fileName.slice(lastDot) : '';
    const base = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;
    let candidate = fileName;
    let counter = 2;
    while (existingNames.includes(candidate)) {
        candidate = `${base} (${counter})${ext}`;
        counter++;
    }
    return candidate;
}

module.exports = {
    customId: 'announcementMediaModal',
    async execute(interaction) {
        await interaction.deferUpdate();

        const setupMessageEmbeds = interaction.message.embeds;
        const rebuiltEmbeds = setupMessageEmbeds.map(e => EmbedBuilder.from(e));

        const attachments = interaction.fields.getUploadedFiles('announcementMediaInput');

        let announcementId;
        let setupEmbed;

        if (rebuiltEmbeds.length == 2) {
            setupEmbed = rebuiltEmbeds[1];
        } else {
            setupEmbed = rebuiltEmbeds[0];
        }

        const match = setupEmbed.data.footer.text.match(/\d+/);
        const count = match ? Number(match[0]) : 0;
        const totalAttachments = count + attachments.size;

        if (totalAttachments > 10) {
            const replyMessage = await interaction.followUp({ content: `Please only add up to 10 files.\nThere are already ${count} files attached and you tried to upload ${attachments.size} additional files.`, flags: MessageFlags.Ephemeral });
            await new Promise(resolve => setTimeout(resolve, 5000));
            await interaction.deleteReply(replyMessage);
            return;
        }

        for (const field of setupEmbed.data.fields) {
            if (field.name.includes('Announcement ID')) {
                announcementId = field.value.slice(2);
            }
        }

        const existingMedia = await getAnnouncementMedia(announcementId);

        const updatedMedia = [...existingMedia];
        const existingNames = existingMedia.map(m => m.name);

        for (const [, attachment] of attachments) {
            const name = resolveUniqueName(existingNames, attachment.name);
            existingNames.push(name);
            updatedMedia.push({ url: attachment.url, name });
        }

        await setAnnouncementMedia(announcementId, updatedMedia);

        setupEmbed.setFooter({ text: `${totalAttachments} Attachments uploaded` });

        await interaction.editReply({ embeds: rebuiltEmbeds });
        const replyMessage = await interaction.followUp({ content: `Media successfully added. Total ${totalAttachments} files attached.`, flags: MessageFlags.Ephemeral });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};

const { MessageFlags, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

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
            const replyMessage = await interaction.followUp({ content: `Please only add up to 10 files.\nThere are already ${count} files attached and you tried to upload ${attachments.size} additional files..`, flags: MessageFlags.Ephemeral });
            await new Promise(resolve => setTimeout(resolve, 5000));
            await interaction.deleteReply(replyMessage);
        }

        for (const field of setupEmbed.data.fields) {
            if (field.name.includes('Announcement ID')) {
                announcementId = field.value.slice(2);
            }
        }

        const baseDir = path.join(__dirname, '..', 'Attachments', announcementId);
        fs.mkdirSync(baseDir, { recursive: true });

        try {
            for (const [, attachment] of attachments) {
                const fileUrl = attachment.url;
                const fileName = attachment.name;
                const savePath = path.join(baseDir, fileName);

                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);

                const fileStream = fs.createWriteStream(savePath);
                await pipeline(response.body, fileStream);
            }
        } catch (error) {
            console.error(error);
            return await interaction.followUp({ content: '❌ Failed to save one or more files.', flags: MessageFlags.Ephemeral });
        }

        setupEmbed.setFooter({ text: `${totalAttachments} Attachments uploaded` });

        await interaction.editReply({ embeds: rebuiltEmbeds });
        const replyMessage = await interaction.followUp({ content: `Media successfully added. Total ${totalAttachments} files attached.`, flags: MessageFlags.Ephemeral });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};
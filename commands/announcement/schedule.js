const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { v4: uuidv4 } = require('uuid');
const { addAnnouncement } = require('../../database/announcements');
const { MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
    const attachments = [];
    for (let i = 1; i <= 10; i++) {
        const file = interaction.options.getAttachment(`file_${i}`);
        if (file) attachments.push(file);
    }

    const announcementId = uuidv4();

    if (attachments.length !== 0) {
        await interaction.editReply({ content: 'Saving uploaded files', flags: MessageFlags.Ephemeral })

        const baseDir = path.join(__dirname, '..', '..', 'Attachments', announcementId);
        fs.mkdirSync(baseDir, { recursive: true });

        try {
            for (const attachment of attachments) {
                const fileUrl = attachment.url;
                const fileName = attachment.name;
                const savePath = path.join(baseDir, fileName);

                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);

                const fileStream = fs.createWriteStream(savePath);
                await pipeline(response.body, fileStream);
            }
        } catch (error) {
            console.error(err);
            return await interaction.editReply('❌ Failed to save one or more files.');
        }

        await interaction.editReply({ content: 'Files saved successfully', flags: MessageFlags.Ephemeral })
    }
};

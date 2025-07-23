const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { v4: uuidv4 } = require('uuid');
const { MessageFlags, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = async (interaction) => {
    const attachments = [];
    for (let i = 1; i <= 10; i++) {
        const file = interaction.options.getAttachment(`file_${i}`);
        if (file) attachments.push(file);
    }

    const announcementId = uuidv4();

    if (attachments.length !== 0) {
        await interaction.editReply({ content: 'Saving uploaded files...', flags: MessageFlags.Ephemeral });

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
            console.error(error);
            return await interaction.editReply('❌ Failed to save one or more files.');
        }
    }

    const announcementSetupEmbed = new EmbedBuilder()
        .setColor(0x00008B)
        .setTitle('Setup Announcement')
        .setDescription('Setup your announcement! Use the Drop-Down below to set the announcement fields.')
        .addFields(
            { name: '✏️ Announcement Text', value: 'Not Set ❌', inline: false },
            { name: '#️⃣ Announcement Channel', value: 'Not Set ❌', inline: false },
            { name: '🗓️ Announcement Time', value: 'Not Set ❌', inline: false },
        );

    const announcementSetupSelect = new StringSelectMenuBuilder()
        .setCustomId('announcementSetupSelect')
        .setPlaceholder('⚙️ Setup your Annoncement!')
        .setMaxValues(1)
        .setMinValues(0)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Set Announcement Text')
                .setEmoji('✏️')
                .setValue('setAnnouncementText')
                .setDescription('Set the Text for the Announcement'),

            new StringSelectMenuOptionBuilder()
                .setLabel('Set Announcement Channel')
                .setEmoji('#️⃣')
                .setValue('setAnnouncementChannel')
                .setDescription('Set the Channel for the Announcement'),

            new StringSelectMenuOptionBuilder()
                .setLabel('Set Announcement Time')
                .setEmoji('🗓️')
                .setValue('setAnnouncementTime')
                .setDescription('Set the Time for the Announcement')
        );

    const buildEmbedRow = new ActionRowBuilder().addComponents(announcementSetupSelect);

    const announcementConfirmButton = new ButtonBuilder()
        .setCustomId('announcementConfirmButton')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success);

    const announcementCancelButton = new ButtonBuilder()
        .setCustomId('announcementCancelButton')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

    const confirmCancelRow = new ActionRowBuilder().addComponents(announcementConfirmButton, announcementCancelButton);

    await interaction.editReply({ embeds: [announcementSetupEmbed], components: [buildEmbedRow, confirmCancelRow], flags: MessageFlags.Ephemeral });
};

const { v4: uuidv4 } = require('uuid');
const { checkSettingsExist } = require('../../database/settings');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const announcementSetupSelect = new StringSelectMenuBuilder()
    .setCustomId('announcementSetupSelect')
    .setPlaceholder('⚙️ Setup your Annoncement!')
    .setMaxValues(1)
    .setMinValues(0)
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('Set Text')
            .setEmoji('✏️')
            .setValue('setAnnouncementText')
            .setDescription('Set the Text for the Announcement'),

        new StringSelectMenuOptionBuilder()
            .setLabel('Add Media')
            .setEmoji('🖼️')
            .setValue('addAnnouncementMedia')
            .setDescription('Add Images, Videos or Files to the Announcement'),

        new StringSelectMenuOptionBuilder()
            .setLabel('Remove Media')
            .setEmoji('🗑️')
            .setValue('removeAnnouncementMedia')
            .setDescription('Remove media files from the Announcement'),

        new StringSelectMenuOptionBuilder()
            .setLabel('Set Channel')
            .setEmoji('#️⃣')
            .setValue('setAnnouncementChannel')
            .setDescription('Set the Channel for the Announcement'),

        new StringSelectMenuOptionBuilder()
            .setLabel('Set Date & Time')
            .setEmoji('🕰️')
            .setValue('setAnnouncementTime')
            .setDescription('Set the Date & Time for the Announcement')
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


module.exports = async (interaction) => {
    const { userExists, guildExists } = await checkSettingsExist(interaction.user.id, interaction.guild.id);

    if (!userExists && !guildExists) {
        return await interaction.editReply('You do not have server or user settings setup, please use the following setup commands before using the bot:\n- </settings user:1424843784826654794>\n- </settings server:1424843784826654794> ');
    }

    if (!userExists) {
        return await interaction.editReply('You do not have user settings setup, please use </settings user:1424843784826654794> before using the bot.');
    }

    if (!guildExists) {
        return await interaction.editReply('You do not have server settings setup, please use </settings server:1424843784826654794> before using the bot.');
    }

    const announcementId = uuidv4();
    const announcementName = interaction.options.getString('name');

    const announcementSetupEmbed = new EmbedBuilder()
        .setColor(0x00008B)
        .setTitle('Setup Announcement')
        .setDescription('Setup your announcement! Use the Drop-Down below to set the announcement fields.')
        .setFooter({ text: '0 Attachments uploaded' })
        .addFields(
            { name: '🏷️ Announcement Name', value: `- ${announcementName}`, inline: false },
            { name: '🪪 Announcement ID', value: `- ${announcementId}`, inline: false },
            { name: '✏️ Announcement Text', value: '- Not Set ❌', inline: false },
            { name: '#️⃣ Announcement Channel', value: '- Not Set ❌', inline: false },
            { name: '🗓️ Announcement Date & Time', value: '- Not Set ❌', inline: false }
        );

    await interaction.editReply({ content: '', embeds: [announcementSetupEmbed], components: [buildEmbedRow, confirmCancelRow] });
};

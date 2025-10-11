const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, ChannelType, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, LabelBuilder } = require('discord.js');
const { getUserConfiguration } = require('../database/settings');

// ANNOUNCEMENT TEXT SETUP
const announcementTextModal = new ModalBuilder()
    .setCustomId('announcementTextModal')
    .setTitle('Set Announcement Text');

const announcementTextInput = new TextInputBuilder()
    .setCustomId('announcementTextInput')
    .setPlaceholder('Hello people! This is an announcement, that is supposed to inform you of something!')
    .setRequired(true)
    .setMaxLength(4_000)
    .setStyle(TextInputStyle.Paragraph);

const announcementTextLabel = new LabelBuilder()
    .setLabel('Announcement Text')
    .setDescription('Enter the Announcement Text. Up to 4000 Characters.')
    .setTextInputComponent(announcementTextInput);

announcementTextModal.addLabelComponents(announcementTextLabel);

// ANNOUNCEMENT DATE SETUP
function announcementTimeModalSetup(timezone) {
    const announcementTimeModal = new ModalBuilder()
        .setCustomId('announcementTimeModal')
        .setTitle('Set Announcement Date & Time');

    const announcementDateInput = new TextInputBuilder()
        .setCustomId('announcementDateInput')
        .setPlaceholder('2001-09-11')
        .setRequired(true)
        .setMaxLength(10)
        .setMinLength(8)
        .setStyle(TextInputStyle.Short);

    const announcementDateLabel = new LabelBuilder()
        .setLabel('Announcement Date')
        .setDescription('Enter the date in YYYY-MM-DD Format')
        .setTextInputComponent(announcementDateInput);

    function formatHourLabel(hour24) {
        const period = hour24 >= 12 ? 'PM' : 'AM';
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        return `${hour12} ${period} (${hour24.toString().padStart(2, '0')})`;
    }

    const hourOptions = Array.from({ length: 24 }, (_, hour) =>
        new StringSelectMenuOptionBuilder()
            .setEmoji('🕰️')
            .setLabel(formatHourLabel(hour))
            .setValue(hour.toString().padStart(2, '0'))
    );

    const minuteOptions = Array.from({ length: 13 }, (_, i) => {
        const minute = i * 5;
        return new StringSelectMenuOptionBuilder()
            .setEmoji('🕰️')
            .setLabel(`${minute.toString().padStart(2, '0')} min`)
            .setValue(minute.toString().padStart(2, '0'));
    });

    const announcementHourSelect = new StringSelectMenuBuilder()
        .setCustomId('announcementHourSelect')
        .setPlaceholder('⏳ Select Announcement Hour')
        .addOptions(hourOptions);

    const announcementMinuteSelect = new StringSelectMenuBuilder()
        .setCustomId('announcementMinuteSelect')
        .setPlaceholder('⌛ Select Announcement Minute')
        .addOptions(minuteOptions);

    const announcementHourLabel = new LabelBuilder()
        .setLabel('Announcement Hour')
        .setDescription(`Select the Announcement Hour in ${timezone} timezone`)
        .setStringSelectMenuComponent(announcementHourSelect);

    const announcementMinuteLabel = new LabelBuilder()
        .setLabel('Announcement Minute')
        .setDescription(`Select the Announcement Minute in ${timezone} timezone`)
        .setStringSelectMenuComponent(announcementMinuteSelect);

    announcementTimeModal.addLabelComponents(announcementDateLabel, announcementHourLabel, announcementMinuteLabel);

    return announcementTimeModal;
}

// ANNOUNCEMENT CHANNEL SETUP
const announcementChannelSelect = new ChannelSelectMenuBuilder()
    .setCustomId('announcementChannelSelect')
    .setPlaceholder('#️⃣ Select Announcement Channel')
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.PrivateThread, ChannelType.PublicThread);

const announcementChannelRow = new ActionRowBuilder().addComponents(announcementChannelSelect);

module.exports = {
    customId: 'announcementSetupSelect',
    async execute(interaction) {
        const selectedValue = interaction.values[0];

        if (!selectedValue) {
            await interaction.deferUpdate();
        }
        else if (selectedValue === 'setAnnouncementText') {
            return await interaction.showModal(announcementTextModal);
        }
        else if (selectedValue === 'setAnnouncementTime') {
            const { timezone } = await getUserConfiguration(interaction.user.id);
            await interaction.showModal(announcementTimeModalSetup(timezone));
            return interaction.client.userTimezones.set(interaction.user.id, timezone);
        }

        if (selectedValue === 'setAnnouncementChannel') {
            await interaction.reply({ content: 'Select the channel for your Announcement below', components: [announcementChannelRow], flags: MessageFlags.Ephemeral });
        }
    }
};
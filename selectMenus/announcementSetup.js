const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, ChannelType, MessageFlags } = require('discord.js');

const announcementTextModal = new ModalBuilder()
    .setCustomId('announcementTextModal')
    .setTitle('Set Announcement Text');

const announcementTextInput = new TextInputBuilder()
    .setCustomId('announcementTextInput')
    .setLabel('Enter the Announcement Text')
    .setPlaceholder('Hello people! This is an announcement, that is supposed to inform you of something!')
    .setRequired(true)
    .setMaxLength(4_000)
    .setStyle(TextInputStyle.Paragraph);

const announcementTextRow = new ActionRowBuilder().addComponents(announcementTextInput);

announcementTextModal.addComponents(announcementTextRow);

const announcementChannelSelect = new ChannelSelectMenuBuilder()
    .setCustomId('announcementChannelSelect')
    .setPlaceholder('#️⃣ Select Announcement Channel')
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.PrivateThread, ChannelType.PublicThread);

const announcementChannelRow = new ActionRowBuilder().addComponents(announcementChannelSelect);

module.exports = {
    customId: 'announcementSetupSelect',
    async execute(interaction) {
        selectedValue = interaction.values[0];

        if (selectedValue === undefined) {
            await interaction.deferUpdate();
        }
        else if (selectedValue === 'setAnnouncementText') {
            return await interaction.showModal(announcementTextModal);
        }
        else if (selectedValue === 'setAnnouncementChannel') {
            await interaction.reply({ content: 'Select the channel for your Announcement below', components: [announcementChannelRow], flags: MessageFlags.Ephemeral });
        }
    }
};
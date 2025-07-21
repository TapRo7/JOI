const { MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'announcementTextModal',
    async execute(interaction) {
        await interaction.deferUpdate();

        const setupMessageEmbeds = interaction.message.embeds;
        const rebuiltEmbeds = setupMessageEmbeds.map(e => EmbedBuilder.from(e));

        const announcementText = interaction.fields.getTextInputValue('announcementTextInput');

        const announcementTextEmbed = new EmbedBuilder()
            .setTitle('Announcement Preview')
            .setColor(0x00008B)
            .setDescription(announcementText)
            .setFooter({ text: 'Please ensure that your emojis and pings are formatted with the IDs to appear properly from the bot.' });

        if (rebuiltEmbeds.length === 1) {
            rebuiltEmbeds.unshift(announcementTextEmbed);
        }
        else if (rebuiltEmbeds.length === 2) {
            rebuiltEmbeds[0] = announcementTextEmbed;
        }

        embedToUpdate = rebuiltEmbeds[1];
        const oldFields = embedToUpdate.data.fields;

        const newFields = oldFields.map(field => {
            if (field.name.includes('Announcement Text')) {
                return {
                    name: field.name,
                    value: 'Announcement text is set! Preview Embed can be seen above. ✅',
                    inline: field.inline
                };
            }
            return field;
        });

        embedToUpdate.setFields(newFields);

        await interaction.editReply({ embeds: rebuiltEmbeds });
        await interaction.followUp({ content: 'Announcement field updated successfully.\nThere is a preview of the announcement added in the top embed, you can review it, and make changes by selecting the Announcement Text option again if you wish to do so.', flags: MessageFlags.Ephemeral });
    },
};
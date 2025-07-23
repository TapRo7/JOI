const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    customId: 'announcementChannelSelect',
    async execute(interaction) {
        await interaction.deferUpdate();
        await interaction.deleteReply();

        const selectedValue = interaction.values[0];

        const channel = interaction.client.channels.cache.get(selectedValue);

        if (!channel) {
            return await interaction.followUp({ content: 'The selected channel could not be found in the bot\'s cache, please ensure you\'re selecting a valid channel.', flags: MessageFlags.Ephemeral });
        }

        const setupMessageId = interaction.message.reference.messageId;
        const setupMessage = await interaction.fetchReply(setupMessageId);
        const setupMessageEmbeds = setupMessage.embeds;
        const rebuiltEmbeds = setupMessageEmbeds.map(e => EmbedBuilder.from(e));

        let embedToUpdate;

        if (rebuiltEmbeds.length === 1) {
            embedToUpdate = rebuiltEmbeds[0];
        }
        else if (rebuiltEmbeds.length === 2) {
            embedToUpdate = rebuiltEmbeds[1];
        }

        const oldFields = embedToUpdate.data.fields;

        const newFields = oldFields.map(field => {
            if (field.name.includes('Announcement Channel')) {
                return {
                    name: field.name,
                    value: `- <#${selectedValue}> ✅`,
                    inline: field.inline
                };
            }
            return field;
        });

        embedToUpdate.setFields(newFields);

        await interaction.editReply({ embeds: rebuiltEmbeds, message: setupMessageId });
        const replyMessage = await interaction.followUp({ content: 'Announcement channel updated successfully.\nYou can see the channel mentioned in the embed above.', flags: MessageFlags.Ephemeral });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};
const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'announcementChannelSelect',
    async execute(interaction) {
        await interaction.deferUpdate();

        const selectedValue = interaction.values[0];

        const channel = interaction.client.channels.cache.get(selectedValue);

        if (!channel) {
            return await interaction.editReply({ content: 'The selected channel could not be found in the bot\'s cache, please ensure you\'re selecting a valid channel.', components: [] });
        }

        const channelPermissions = channel.permissionsFor(interaction.guild.members.me);

        if (!channelPermissions.has('ManageWebhooks')) {
            return await interaction.editReply({ content: 'I do not have the required permissions in the selected channel.\nPlease ensure I have `Manage Webhooks` permissions in the selected channel.', components: [] });
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
        const replyMessage = await interaction.editReply({ content: 'Announcement channel updated successfully.\nYou can see the channel mentioned in the embed above.', components: [] });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};
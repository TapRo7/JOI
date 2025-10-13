const { EmbedBuilder, MessageFlags } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
    customId: 'announcementTimeModal',
    async execute(interaction) {
        await interaction.deferUpdate();

        const setupMessageEmbeds = interaction.message.embeds;
        const rebuiltEmbeds = setupMessageEmbeds.map(e => EmbedBuilder.from(e));

        const dateInput = interaction.fields.getTextInputValue('announcementDateInput').trim();
        const hourInput = interaction.fields.getStringSelectValues('announcementHourSelect')[0];
        const minuteInput = interaction.fields.getStringSelectValues('announcementMinuteSelect')[0];

        const userTimezone = interaction.client.userTimezones.get(interaction.user.id);

        const fullDateTime = `${dateInput} ${hourInput}:${minuteInput}`;
        const localMoment = moment.tz(fullDateTime, 'YYYY-M-D HH:mm', userTimezone);

        if (!localMoment.isValid()) {
            const errorReply = await interaction.followUp({ content: 'Invalid date or time entered. Please check your inputs and try again.', flags: MessageFlags.Ephemeral });
            await new Promise(resolve => setTimeout(resolve, 5000));
            return interaction.deleteReply(errorReply);
        }

        const epochTimestamp = Math.floor(localMoment.valueOf() / 1000);
        const currentEpoch = Math.floor(Date.now() / 1000);

        if (epochTimestamp - currentEpoch < 600) {
            return await interaction.followUp({ content: 'The announcement time must be at least **10 minutes in the future**.', flags: MessageFlags.Ephemeral });
        }

        const hour24 = localMoment.format('HH');
        const hour12 = localMoment.format('h');
        const period = localMoment.format('A');
        const minute = localMoment.format('mm');
        const date = localMoment.format('YYYY-MM-DD');

        const formattedLine = `- **Time:** ${hour12}:${minute} ${period} (${hour24}:${minute}) | ${userTimezone} Timezone\n- **Date:** ${date}\n- **Timestamp:** <t:${epochTimestamp}:F>`;

        let embedToUpdate;

        if (rebuiltEmbeds.length === 1) {
            embedToUpdate = rebuiltEmbeds[0];
        }
        else if (rebuiltEmbeds.length === 2) {
            embedToUpdate = rebuiltEmbeds[1];
        }

        const oldFields = embedToUpdate.data.fields;

        const newFields = oldFields.map(field => {
            if (field.name.includes('Announcement Date & Time')) {
                return {
                    name: field.name,
                    value: formattedLine,
                    inline: field.inline
                };
            }
            return field;
        });

        embedToUpdate.setFields(newFields);

        await interaction.editReply({ embeds: rebuiltEmbeds });

        const replyMessage = await interaction.followUp({ content: 'Announcement Date & Time updated sucessfully. You can view the time in the embed above to ensure it is correct.', flags: MessageFlags.Ephemeral });

        await new Promise(resolve => setTimeout(resolve, 5000));
        await interaction.deleteReply(replyMessage);
    }
};

const { PermissionFlagsBits } = require('discord.js');
const { editGuildConfiguration } = require('../../database/settings');

const imageUrlRegex = /\.(png|jpe?g|webp)(\?.*)?$/i;

module.exports = async (interaction) => {
    const webhookProfileName = interaction.options.getString('announcer_name');
    const webhookProfileUrl = interaction.options.getAttachment('announcer_profile').url;
    const errorChannel = interaction.options.getChannel('error_channel');

    if (!imageUrlRegex.test(webhookProfileUrl)) {
        return await interaction.editReply({ content: 'Please upload a valid PNG, JPEG, or WEBP file for the profile picture.' });
    }

    const channelPermissions = interaction.channel.permissionsFor(interaction.guild.members.me);

    if (!channelPermissions.has(PermissionFlagsBits.ManageWebhooks | PermissionFlagsBits.ViewChannel)) {
        return await interaction.editReply({ content: 'I do not have the required permissions in the current channel to create a Webhook.\nPlease ensure I have `Manage Webhooks` and `View Channel` permissions in the selected channel.' });
    }

    const errorChannelPermissions = errorChannel.permissionsFor(interaction.guild.members.me);

    if (!errorChannelPermissions.has(PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages)) {
        return await interaction.editReply({ content: 'I do not have the required permissions to view or send messages in the Error channel.\nPlease ensure I have the `View Channel` and `Send Messages` permissions enabled in the selected channel.' });
    }

    const webhook = interaction.channel.createWebhook({
        name: webhookProfileName,
        avatar: webhookProfileUrl
    });

    await editGuildConfiguration(interaction.guild.id, webhook.url, errorChannel.id, true);

    await interaction.editReply({ content: `Guild Configurations have been set successfully.\n- Announcer Name: ${webhookProfileName}\n- Error Channel: <#${errorChannel.id}>\n- Announcer Profile Picture Attached Below`, files: [webhookProfileUrl] });
};
const { PermissionFlagsBits } = require('discord.js');
const { editGuildConfiguration, getGuildConfiguration } = require('../../database/settings');
const { encryptToken, decryptToken } = require('../../utils/tokenEncryption');

const imageUrlRegex = /\.(png|jpe?g|webp)(\?.*)?$/i;

module.exports = async (interaction) => {
    const webhookProfileName = interaction.options.getString('announcer_name');
    const webhookProfileUrl = interaction.options.getAttachment('announcer_profile').url;
    const errorChannel = interaction.options.getChannel('error_channel');

    if (!imageUrlRegex.test(webhookProfileUrl)) {
        return await interaction.editReply({ content: 'Please upload a valid PNG, JPEG, or WEBP file for the profile picture.' });
    }

    const channelPermissions = interaction.channel.permissionsFor(interaction.guild.members.me);

    if (!channelPermissions.has([PermissionFlagsBits.ManageWebhooks, PermissionFlagsBits.ViewChannel])) {
        return await interaction.editReply({ content: 'I do not have the required permissions in the current channel to create a Webhook.\nPlease ensure I have `Manage Webhooks` and `View Channel` permissions in the selected channel.' });
    }

    const errorChannelPermissions = errorChannel.permissionsFor(interaction.guild.members.me);

    if (!errorChannelPermissions.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
        return await interaction.editReply({ content: 'I do not have the required permissions to view or send messages in the Error channel.\nPlease ensure I have the `View Channel` and `Send Messages` permissions enabled in the selected channel.' });
    }

    let webhook;

    const oldConfiguration = await getGuildConfiguration(interaction.guild.id);

    if (oldConfiguration) {
        try {

            const webhookToken = decryptToken(oldConfiguration.encryptionData, oldConfiguration.webhookId);
            webhook = await interaction.client.fetchWebhook(oldConfiguration.webhookId, webhookToken);

            await webhook.edit({
                name: webhookProfileName,
                avatar: webhookProfileUrl,
                channel: interaction.channel.id
            });
        }
        catch (error) {
            console.error(`Error fetching / editing old webhook ${error}\nCreating new for Guild ${interaction.guild.id}`);
            webhook = await interaction.channel.createWebhook({
                name: webhookProfileName,
                avatar: webhookProfileUrl
            });
        }
    }
    else {
        webhook = await interaction.channel.createWebhook({
            name: webhookProfileName,
            avatar: webhookProfileUrl
        });
    }

    const encryptionData = encryptToken(webhook.token, webhook.id);
    await editGuildConfiguration(interaction.guild.id, webhook.id, encryptionData, errorChannel.id, true);

    await interaction.editReply({ content: `Guild Configurations have been set successfully.\n- Announcer Name: ${webhookProfileName}\n- Error Channel: <#${errorChannel.id}>\n- Announcer Profile Picture Attached Below`, files: [webhookProfileUrl] });
};
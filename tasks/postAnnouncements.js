const { getDueAnnouncements, deleteAnnouncement, editAnnouncement } = require('../database/announcements');
const { getGuildConfiguration } = require('../database/settings');
const { decryptToken } = require('../utils/tokenEncryption');
const fs = require('fs');
const path = require('path');

function getAnnouncementFiles(announcementId) {
    const dir = path.join(__dirname, '..', 'Attachments', announcementId);

    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir)
        .map(fileName => ({
            attachment: path.join(dir, fileName),
            name: fileName
        }));
}

module.exports = {
    name: 'Post Announcements',
    intervalSeconds: 15,
    async run(client) {
        const dueAnnouncements = await getDueAnnouncements();

        for (const announcement of dueAnnouncements) {
            if (announcement.archived) {
                continue;
            }

            const guildId = announcement.guildId;
            const announcementId = announcement._id.toString();

            const failures = client.failedAnnouncements.get(announcementId) ?? 0;

            const guildConfig = await getGuildConfiguration(guildId);

            if (failures > 3) {
                await deleteAnnouncement(announcementId, true);
                client.failedAnnouncements.delete(announcementId);
                continue;
            }

            if (!guildConfig) {
                console.error(`Guild config not found for Guild (${guildId}) for Announcement (${announcementId})`);
                client.failedAnnouncements.set(announcementId, failures + 1);
                continue;
            }

            const errorChannel = client.channels.cache.get(guildConfig.errorChannelId);

            const webhookToken = decryptToken(guildConfig.encryptionData, guildConfig.webhookId);
            let webhook;

            try {
                webhook = await client.fetchWebhook(guildConfig.webhookId, webhookToken);
            }
            catch (error) {
                const errorMessage = `Unable to fetch webhook for Guild (${guildId}) for Announcement (${announcementId})\n${error}`;
                console.error(errorMessage);
                client.failedAnnouncements.set(announcementId, failures + 1);
                await errorChannel.send(`There was an error posting a scheduled announcement in your server. Details:\n\`\`\`\n${errorMessage}\n\`\`\``);
                continue;
            }

            try {
                await webhook.edit({ channel: announcement.channelId });
            }
            catch (error) {
                const errorMessage = `Unable to edit webhook for Guild (${guildId}) for Announcement (${announcementId})\n${error}`;
                console.error(errorMessage);
                client.failedAnnouncements.set(announcementId, failures + 1);
                await errorChannel.send(`There was an error posting a scheduled announcement in your server. Details:\n\`\`\`\n${errorMessage}\n\`\`\``);
                continue;
            }

            try {
                const files = getAnnouncementFiles(announcementId).slice(0, 10);
                await webhook.send({
                    content: announcement.announcementText,
                    files
                });
            }
            catch (error) {
                const errorMessage = `Unable to send webhook message for Guild (${guildId}) for Announcement (${announcementId})\n${error}`;
                console.error(errorMessage);
                client.failedAnnouncements.set(announcementId, failures + 1);
                await errorChannel.send(`There was an error posting a scheduled announcement in your server. Details:\n\`\`\`\n${errorMessage}\n\`\`\``);
                continue;
            }

            await deleteAnnouncement(announcementId);
            client.failedAnnouncements.delete(announcementId);
            fs.rmSync(
                path.join(__dirname, '..', 'Attachments', announcementId),
                { recursive: true, force: true }
            );
        }
    }
};
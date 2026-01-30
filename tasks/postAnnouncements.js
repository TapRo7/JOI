const { getDueAnnouncements, deleteAnnouncement } = require('../database/announcements');
const { getGuildConfiguration } = require('../database/settings');

module.exports = {
    name: 'Post Announcements',
    intervalSeconds: 15,
    async run(client) {
        const dueAnnouncements = await getDueAnnouncements();

        for (const announcement of dueAnnouncements) {
            const guildId = announcement.guildId;
            const announcementId = announcement.announcementId;

            const failures = client.failedAnnouncements.get(announcementId) ?? 0;

            const guildConfig = await getGuildConfiguration(guildId);

            if (failures > 3) {
                await deleteAnnouncement(deleteAnnouncement);
                client.failedAnnouncements.delete(announcementId);
                continue;
            }

            if (!guildConfig) {
                client.failedAnnouncements.set(announcementId, failures + 1);
                continue;
            }

            // Send Announcement

            await deleteAnnouncement(deleteAnnouncement);
            client.failedAnnouncements.delete(announcementId);
        }
    }
};
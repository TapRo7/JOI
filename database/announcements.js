const { insertOne, deleteOne, updateOne, find, findOne } = require('./index');

const COLLECTION_NAME = 'scheduledAnnouncements';
const BACKUP_COLLECTION_NAME = 'backupAnnouncements';

async function addAnnouncement(announcementId, schedulerId, announcementName, channelId, guildId, sendAtEpoch, announcementText, mediaUrls = []) {
    const newAnnouncement = {
        _id: announcementId,
        schedulerId,
        editorId: null,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText,
        mediaUrls,
        archived: false
    };

    return await insertOne(COLLECTION_NAME, newAnnouncement);
}

async function deleteAnnouncement(announcementId, backup = false) {
    if (backup) {
        const doc = await findOne(COLLECTION_NAME, { _id: announcementId });

        if (!doc) {
            throw new Error(`Announcement ${announcementId} not found for backup`);
        }

        const backupDoc = {
            ...doc,
            backUpEpoch: Math.floor(Date.now() / 1000)
        };

        await insertOne(BACKUP_COLLECTION_NAME, backupDoc);
    }

    return deleteOne(COLLECTION_NAME, { _id: announcementId });
}


async function editAnnouncement(announcementId, updates) {
    const $set = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    if (!Object.keys($set).length) return null;

    return updateOne(COLLECTION_NAME, { _id: announcementId }, { $set });
}

async function getDueAnnouncements() {
    const nowEpoch = Math.floor(Date.now() / 1000);
    return await find(COLLECTION_NAME, { sendAtEpoch: { $lte: nowEpoch } });
}

async function getGuildScheduledAnnouncements(guildId) {
    return await find(COLLECTION_NAME, { guildId });
}

module.exports = { addAnnouncement, deleteAnnouncement, editAnnouncement, getDueAnnouncements, getGuildScheduledAnnouncements };
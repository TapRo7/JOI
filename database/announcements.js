const { insertOne, deleteOne, updateOne, findAll } = require('./index');

const COLLECTION_NAME = 'scheduledAnnouncements';

async function addAnnouncement(announcementId, schedulerId, announcementName, channelId, guildId, sendAtEpoch, announcementText) {
    const newAnnouncement = {
        _id: announcementId,
        schedulerId,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText
    };

    return insertOne(COLLECTION_NAME, newAnnouncement);
}

async function deleteAnnouncement(announcementId) {
    return deleteOne(COLLECTION_NAME, { _id: announcementId });
}

async function editAnnouncement(announcementId, schedulerId, announcementName, channelId, guildId, sendAtEpoch, announcementText) {
    const updatedAnnouncement = {
        schedulerId,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText
    };

    return updateOne(COLLECTION_NAME, { _id: announcementId }, updatedAnnouncement);
}

async function getScheduledAnnouncements(guildId) {
    const all = await findAll(COLLECTION_NAME);
    return all.filter(a => a.guildId === guildId);
}

module.exports = { addAnnouncement, deleteAnnouncement, editAnnouncement, getScheduledAnnouncements };
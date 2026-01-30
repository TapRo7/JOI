const { insertOne, deleteOne, updateOne, findAll, find } = require('./index');

const COLLECTION_NAME = 'scheduledAnnouncements';

async function addAnnouncement(announcementId, schedulerId, announcementName, channelId, guildId, sendAtEpoch, announcementText) {
    const newAnnouncement = {
        _id: announcementId,
        schedulerId,
        editorId: null,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText
    };

    return await insertOne(COLLECTION_NAME, newAnnouncement);
}

async function deleteAnnouncement(announcementId) {
    return await deleteOne(COLLECTION_NAME, { _id: announcementId });
}

async function editAnnouncement(announcementId, editorId, announcementName, channelId, guildId, sendAtEpoch, announcementText) {
    const updatedAnnouncement = {
        editorId,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText
    };

    return await updateOne(COLLECTION_NAME, { _id: announcementId }, updatedAnnouncement);
}

async function getDueAnnouncements() {
    const nowEpoch = Math.floor(Date.now() / 1000);
    return await find(COLLECTION_NAME, { sendAtEpoch: { $lte: nowEpoch } });
}

async function getGuildScheduledAnnouncements(guildId) {
    return await find(COLLECTION_NAME, { guildId });
}

module.exports = { addAnnouncement, deleteAnnouncement, editAnnouncement, getDueAnnouncements, getGuildScheduledAnnouncements };
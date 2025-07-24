const { insertOne, deleteOne, updateOne, findAll, find } = require('./index');

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

async function getScheduledAnnouncements() {
    return findAll(COLLECTION_NAME);
}

async function getGuildScheduledAnnouncements(guildId) {
    return find(COLLECTION_NAME, { guildId });
}

module.exports = { addAnnouncement, deleteAnnouncement, editAnnouncement, getScheduledAnnouncements, getGuildScheduledAnnouncements };
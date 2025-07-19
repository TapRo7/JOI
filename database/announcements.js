const { getCollection } = require('./index');

async function addAnnouncement(announcementId, schedulerId, announcementName, channelId, guildId, sendAtEpoch, announcementText) {
    const announcementCollection = getCollection("scheduledAnnouncements");

    const newAnnouncement = {
        _id: announcementId,
        schedulerId,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText
    };

    const result = await announcementCollection.insertOne(newAnnouncement);

    return result.acknowledged;
}

async function deleteAnnouncement(announcementId) {
    const announcementCollection = getCollection("scheduledAnnouncements");

    await announcementCollection.deleteOne({ _id: announcementId });

    return result.deletedCount > 0;
}

async function editAnnouncement(announcementId, schedulerId, announcementName, channelId, guildId, sendAtEpoch, announcementText) {
    const announcementCollection = getCollection("scheduledAnnouncements");

    const updatedAnnouncement = {
        schedulerId,
        announcementName,
        channelId,
        guildId,
        sendAtEpoch,
        announcementText
    };

    await announcementCollection.updateOne({ _id: announcementId }, { $set: updatedAnnouncement });

    return result.modifiedCount > 0;
}

async function getScheduledAnnouncements(guildId) {
    const announcementCollection = getCollection("scheduledAnnouncements");

    const announcements = await announcementCollection.find({ guildId }).toArray();

    return announcements
}

module.exports = { addAnnouncement, deleteAnnouncement, editAnnouncement, getScheduledAnnouncements };
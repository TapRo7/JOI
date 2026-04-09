const Redis = require('ioredis');

const redis = new Redis();

redis.on('error', (error) => {
    console.error('Redis error:', error);
});

async function getAnnouncementMedia(announcementId) {
    const data = await redis.get(`announcementMedia:${announcementId}`);
    return data ? JSON.parse(data) : [];
}

async function setAnnouncementMedia(announcementId, mediaArray) {
    await redis.set(`announcementMedia:${announcementId}`, JSON.stringify(mediaArray), 'EX', 604800);
}

async function deleteAnnouncementMedia(announcementId) {
    await redis.del(`announcementMedia:${announcementId}`);
}

module.exports = { getAnnouncementMedia, setAnnouncementMedia, deleteAnnouncementMedia };

const { insertOne, findOne, deleteOne, updateOne, findAll } = require('./index');

const GUILD_COLLECTION = 'guildConfigurations';
const USER_COLLECTION = 'userConfigurations';

// Guild Configuration Functions
async function addGuildConfiguration(guildId, webhookId, encryptionData, errorChannelId) {
    return insertOne(GUILD_COLLECTION, { guildId, webhookId, encryptionData, errorChannelId });
}

async function deleteGuildConfiguration(guildId) {
    return deleteOne(GUILD_COLLECTION, { guildId });
}

async function editGuildConfiguration(guildId, webhookId, encryptionData, errorChannelId, upsert) {
    return updateOne(GUILD_COLLECTION, { guildId }, { webhookId, encryptionData, errorChannelId }, upsert);
}

async function getGuildConfigurations() {
    return findAll(GUILD_COLLECTION);
}

async function getGuildConfiguration(guildId) {
    return await findOne(GUILD_COLLECTION, { guildId });
}

// User Configuration Functions
async function addUserConfiguration(userId, timezone) {
    return insertOne(USER_COLLECTION, { userId, timezone });
}

async function deleteUserConfiguration(userId) {
    return deleteOne(USER_COLLECTION, { userId });
}

async function editUserConfiguration(userId, timezone, upsert) {
    return updateOne(USER_COLLECTION, { userId }, { timezone }, upsert);
}

async function getUserConfigurations() {
    return findAll(USER_COLLECTION);
}

async function getUserConfiguration(userId) {
    return await findOne(USER_COLLECTION, { userId });
}

// Other Helper Functions
async function checkSettingsExist(userId, guildId) {
    const userExists = await findOne(USER_COLLECTION, { userId }, { projection: { _id: 1 } });
    const guildExists = await findOne(GUILD_COLLECTION, { guildId }, { projection: { _id: 1 } });
    return { userExists, guildExists };
}

module.exports = { addGuildConfiguration, deleteGuildConfiguration, editGuildConfiguration, getGuildConfigurations, getGuildConfiguration, addUserConfiguration, deleteUserConfiguration, editUserConfiguration, getUserConfigurations, getUserConfiguration, checkSettingsExist };
const { insertOne, findOne, deleteOne, updateOne, findAll } = require('./index');

const GUILD_COLLECTION = 'guildConfigurations';
const USER_COLLECTION = 'userConfigurations';

// Guild Configuration Functions
async function addGuildConfiguration(guildId, webhookUrl) {
    return insertOne(GUILD_COLLECTION, { guildId, webhookUrl });
}

async function deleteGuildConfiguration(guildId) {
    return deleteOne(GUILD_COLLECTION, { guildId });
}

async function editGuildConfiguration(guildId, webhookUrl) {
    return updateOne(GUILD_COLLECTION, { guildId }, { webhookUrl });
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

async function editUserConfiguration(userId, timezone) {
    return updateOne(USER_COLLECTION, { userId }, { timezone });
}

async function getUserConfigurations() {
    return findAll(USER_COLLECTION);
}

async function getUserConfiguration(userId) {
    return await findOne(USER_COLLECTION, { userId });
}

module.exports = { addGuildConfiguration, deleteGuildConfiguration, editGuildConfiguration, getGuildConfigurations, getGuildConfiguration, addUserConfiguration, deleteUserConfiguration, editUserConfiguration, getUserConfigurations, getUserConfiguration };
const { insertOne, findOne, deleteOne, updateOne, findAll } = require('./index');

// Guild Configuration Functions
async function addGuildConfiguration(guildId, webhookUrl) {
    return insertOne('guildConfigurations', { guildId, webhookUrl });
}

async function deleteGuildConfiguration(guildId) {
    return deleteOne('guildConfigurations', { guildId });
}

async function editGuildConfiguration(guildId, webhookUrl) {
    return updateOne('guildConfigurations', { guildId }, { webhookUrl });
}

async function getGuildConfigurations() {
    return findAll('guildConfigurations');
}

async function getGuildConfiguration(guildId) {
    return await findOne('guildConfigurations', { guildId });
}

// User Configuration Functions
async function addUserConfiguration(userId, timezone) {
    return insertOne('userConfigurations', { userId, timezone });
}

async function deleteUserConfiguration(userId) {
    return deleteOne('userConfigurations', { userId });
}

async function editUserConfiguration(userId, timezone) {
    return updateOne('userConfigurations', { userId }, { timezone });
}

async function getUserConfigurations() {
    return findAll('userConfigurations');
}

async function getUserConfiguration(userId) {
    return await findOne('userConfigurations', { userId });
}

module.exports = { addGuildConfiguration, deleteGuildConfiguration, editGuildConfiguration, getGuildConfigurations, getGuildConfiguration, addUserConfiguration, deleteUserConfiguration, editUserConfiguration, getUserConfigurations, getUserConfiguration };
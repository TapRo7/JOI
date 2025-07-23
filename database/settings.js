const { getCollection } = require('./index');

async function addGuildConfiguration(guildId, webhookUrl) {
    const guildConfigurationsCollection = getCollection('guildConfigurations');

    const newGuildConfig = {
        guildId,
        webhookUrl
    };

    const result = await guildConfigurationsCollection.insertOne(newGuildConfig);

    return result.acknowledged;
}

async function deleteGuildConfiguration(guildId) {
    const guildConfigurationsCollection = getCollection('guildConfigurations');

    const result = await guildConfigurationsCollection.deleteOne({ guildId });

    return result.deletedCount > 0;
}

async function editGuildConfiguration(guildId, webhookUrl) {
    const guildConfigurationsCollection = getCollection('guildConfigurations');

    const newGuildConfig = {
        webhookUrl
    };

    const result = await guildConfigurationsCollection.updateOne({ guildId }, { $set: newGuildConfig });

    return result.modifiedCount > 0;
}

async function getGuildConfigurations() {
    const guildConfigurationsCollection = getCollection('guildConfigurations');

    const guildConfigurations = await guildConfigurationsCollection.find().toArray();

    return guildConfigurations;
}

async function addUserConfiguration(userId, timezone) {
    const userConfigurationsCollection = getCollection('userConfigurations');

    const newUserConfig = {
        userId,
        timezone
    };

    const result = await userConfigurationsCollection.insertOne(newUserConfig);

    return result.acknowledged;
}

async function deleteUserConfiguration(userId) {
    const userConfigurationsCollection = getCollection('userConfigurations');

    const result = await userConfigurationsCollection.deleteOne({ userId });

    return result.deletedCount > 0;
}

async function editUserConfiguration(userId, timezone) {
    const userConfigurationsCollection = getCollection('userConfigurations');

    const newUserConfig = {
        userId,
        timezone
    };

    const result = await userConfigurationsCollection.updateOne({ userId }, { $set: newUserConfig });

    return result.modifiedCount > 0;
}

async function getUserConfigurations() {
    const userConfigurationsCollection = getCollection('userConfigurations');

    const userConfigurations = await userConfigurationsCollection.find().toArray();

    return userConfigurations;
}

module.exports = { addGuildConfiguration, deleteGuildConfiguration, editGuildConfiguration, getGuildConfigurations, addUserConfiguration, deleteUserConfiguration, editUserConfiguration, getUserConfigurations };
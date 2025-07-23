const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const databaseClient = new MongoClient(uri);
const requiredCollections = ['scheduledAnnouncements', 'guildConfigurations', 'userConfigurations'];

let database;

async function connectToDatabase() {
  await databaseClient.connect();
  database = databaseClient.db('botDatabase');
  console.log('Connected to MongoDB');
}

async function setupDatabase() {
  const collections = await database.listCollections({}, { nameOnly: true }).toArray();
  const collectionNames = collections.map(col => col.name);

  for (const name of requiredCollections) {
    if (!collectionNames.includes(name)) {
      await database.createCollection(name);
      console.log(`Created "${name}" collection`);
    } else {
      console.log(`"${name}" collection found`);
    }
  }
}

function getCollection(name) {
  return database.collection(name);
}

module.exports = { connectToDatabase, getCollection, setupDatabase };
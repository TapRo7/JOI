const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const databaseClient = new MongoClient(uri);

let database;

async function connectToDatabase() {
  await databaseClient.connect();
  database = databaseClient.db('botDatabase');
  console.log('Connected to MongoDB');
}

async function setupDatabase() {
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const collectionNames = collections.map(col => col.name);

  if (!collectionNames.includes('scheduledAnnouncements')) {
    await db.createCollection('scheduledAnnouncements');
    console.log('Created "scheduledAnnouncements" collection');
  } else {
    console.log('"scheduledAnnouncements" collection found');
  }
}

function getCollection(name) {
  return database.collection(name);
}

module.exports = { connectToDatabase, getCollection, setupDatabase };
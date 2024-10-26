const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load environment variables
if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  require('dotenv').config({ path: '.env.local' });
} else {
  console.warn('Warning: .env.local file not found. Make sure your MongoDB URI is set in the environment.');
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = 'pleasurebd'; // Explicitly set the database name

  if (!uri) {
    console.error('Error: MONGODB_URI is not set in the environment variables.');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    const db = client.db(dbName); // Use the specified database name
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await client.close();
  }
}

testConnection();

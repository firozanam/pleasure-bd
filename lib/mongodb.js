import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
const dbName = 'pleasurebd' // Explicitly set the database name

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

async function connect() {
  try {
    if (client) {
      return client
    }
    client = new MongoClient(uri, options)
    await client.connect()
    console.log('Connected to MongoDB')
    return client
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = connect()
}

export async function getDatabase() {
  try {
    const client = await clientPromise
    return client.db(dbName) // Use the specified database name
  } catch (error) {
    console.error('Error getting database:', error)
    throw error
  }
}

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      ...options,
      dbName: dbName // Specify the database name for Mongoose
    })
    console.log('Connected to MongoDB via Mongoose')
    return mongoose.connection.db
  } catch (error) {
    console.error('Failed to connect to MongoDB via Mongoose:', error)
    throw error
  }
}

export { clientPromise }

// Export an object with all functions for backwards compatibility
export default { dbConnect, getDatabase, clientPromise }

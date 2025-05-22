import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // load from env
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the client across hot reloads in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for every connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function connectToDB() {
  const client = await clientPromise;
  return client.db();
}

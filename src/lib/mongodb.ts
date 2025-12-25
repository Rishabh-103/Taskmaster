import {MongoClient} from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}
const URI = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}
else {
  client = new MongoClient(URI, options);
  clientPromise = client.connect();
}

export default clientPromise;

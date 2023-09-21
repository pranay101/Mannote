// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};


export async function getMongoClient() {
    const client = new MongoClient(process.env.MONGODB_URI!, {});
    await client.connect();
    return client;
}

let client;
let clientPromise: Promise<MongoClient>;


// In production mode, it's best to not use a global variable.
client = new MongoClient(uri, options);
clientPromise = client.connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
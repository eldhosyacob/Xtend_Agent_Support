import { MongoClient } from 'mongodb';

let client;
let db;

const connectToDatabase = async () => {
  if (!client) {
    client = await MongoClient.connect(process.env.DB_URI);
    db = client.db(process.env.DB);
  }

  return db;
};

export default connectToDatabase;
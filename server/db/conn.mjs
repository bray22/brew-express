import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

const connectionString = process.env.ATLAS_URI || "";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// const client = new MongoClient(connectionString);

// let conn;
// try {
//   conn = await client.connect();
// } catch(e) {
//   console.error(e);
// }

// let db = conn.db("alestars");

export default db;
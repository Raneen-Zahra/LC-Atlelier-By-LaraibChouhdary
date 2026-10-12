import { MongoClient, Db } from 'mongodb';

let cached: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  if (!cached) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    cached = client
      .connect()
      .then((c) => c.db())
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}
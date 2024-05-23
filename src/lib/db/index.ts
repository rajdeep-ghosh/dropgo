import mongoose from 'mongoose';

let isConnected = false;

async function dbConnect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect('mongodb://localhost:27017', {
      dbName: 'dropgo_db'
    });
    isConnected = !!db.connections[0].readyState;
    console.log('connected to db');
  } catch (err) {
    console.log(err);
  }
}

export { dbConnect };

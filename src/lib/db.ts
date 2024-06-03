import mongoose from 'mongoose';

async function dbConnect() {
  // check if db connection already exists
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected)
    return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'dropgo_db'
    });
    console.log('connected to db');
  } catch (err) {
    if (err instanceof Error)
      console.error('error connecting to db:', err.message);
    throw new Error('failed to connect to db');
  }
}

export { dbConnect };

import mongoose from 'mongoose';

/**
 * Tries to connect to MongoDB. Never throws — controllers consult
 * `mongoose.connection.readyState` and fall back to dummy data on failure.
 */
export async function connectDatabase(uri) {
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set — running in MOCK mode (dummyData.js).');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ MongoDB connected.');

    mongoose.connection.on('disconnected', () =>
      console.warn('⚠️  MongoDB disconnected — falling back to MOCK data on next request.')
    );
    mongoose.connection.on('reconnected', () =>
      console.log('✅ MongoDB reconnected.')
    );
    return true;
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.warn('⚠️  Continuing in MOCK mode (dummyData.js).');
    return false;
  }
}

export function isDbConnected() {
  // 1 = connected. 2 = connecting (treat as not-yet-usable).
  return mongoose.connection.readyState === 1;
}

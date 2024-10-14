import mongoose from 'mongoose';
import fs from 'fs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to log error to a file
function logErrorToFile(error) {
  const errorMessage = `${new Date().toISOString()}: ${error.message}\n`;

  // Append the error message to a log file
  fs.appendFile('mongoose-errors.log', errorMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    } else {
      console.log('Mongoose error logged to mongoose-errors.log');
    }
  });
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Log the error to a file
    logErrorToFile(e);

    // Reset the promise so it can be retried
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Log any error after the connection is established
mongoose.connection.on('error', logErrorToFile);

export default dbConnect;

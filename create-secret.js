import crypto from 'crypto';

// Generate a 32-byte (256-bit) random secret
const secret = crypto.randomBytes(32).toString('hex');

console.log(secret);
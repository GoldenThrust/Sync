import { model, Schema } from 'mongoose';
import { generateUsername } from '../utils/functions.js';

const UserSchema = new Schema({
    googleId: {
        type: String,
        unique: true
    },
    socketId: {
        type: String
    },
    username: {
        type: String,
        default: generateUsername(),
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    image: String,
    active: {
        type: Boolean,
        default: false
    },
    privacypolicy: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

async function createUniqueUsername(model, username = null) {
    username = username ?? generateUsername();
    const user = await model.findOne({ username });

    if (user) {
        return createUniqueUsername(model);
    } else {
        return username;
    }

}


// require password if googleId is not set and vice versa
UserSchema.pre('save', async function (next) {
    if (!this.googleId && !this.password) {
        return next(new Error('Either googleId or password must be set'));
    }

    this.username = await createUniqueUsername(this.constructor, this.username);

    next();
});

const User = model('User', UserSchema);
export default User;

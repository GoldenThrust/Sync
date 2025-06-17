import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
    googleId: {
        type: String,
        unique: true
    },
    fullname: {
        type: String,
        required: true
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


// require password if googleId is not set and vice versa
UserSchema.pre('save', function (next) {
    if (!this.googleId && !this.password) {
        return next(new Error('Either googleId or password must be set'));
    }
    if (this.googleId && this.password) {
        return next(new Error('Only one of googleId or password can be set'));
    }
    next();
});

const User = model('User', UserSchema);
export default User;

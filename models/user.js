import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
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
        required: true
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

const User = model('User', UserSchema);
export default User;

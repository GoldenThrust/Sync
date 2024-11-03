import { model, Schema } from 'mongoose';

const SessionSchema = new Schema({
    sessionId: {
        type: String,
        required: true
    },
    activeUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },
    invitedUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },
    activeDate: {
        type: Date,
        default: new Date(),
    },
    expireDate: {
        type: Date,
    },
    visibility: {
        type: ['private', 'public'],
        required: true
    },
    passcode: String
}, { timestamps: true })

const Session = model('Session', SessionSchema);
export default Session;

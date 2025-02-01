import { model, Schema } from 'mongoose';

const SessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    activeUsers: {
      type: [Schema.Types.Mixed],
      ref: 'User',
    },
    invitedUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    activeDate: {
      type: Date,
      default: () => new Date(),
    },
    duration: {
      type: Number,
      default: 3600000,
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'public',
    },
    passcode: {
      type: String,
    },
  },
  { timestamps: true }
);

const Session = model('Session', SessionSchema);
export default Session;

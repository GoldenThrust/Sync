import { model, Schema } from 'mongoose';

const chatSchema = new Schema({
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    messages: {
        type: String,
        required: true,
    },
    mimeTypes: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Chat = model("Chat", chatSchema);
export default Chat;

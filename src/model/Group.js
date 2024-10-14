import mongoose, { Schema } from 'mongoose';

const GroupSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Group =  mongoose.models.Group || mongoose.model('Group', GroupSchema);

import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    cid: {
        type: String,
        required: true,
        unique: true,
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
    },
    visibility_type: {
        type: String,
        enum: ['edit', 'view'],
        default: 'view',
    }
}, { timestamps: true });

export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
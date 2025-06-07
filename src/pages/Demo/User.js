const contactHistorySchema = new mongoose.Schema({
    propertyId: {
        type: String,
        // CHANGE: Make propertyId not required since we now support project contacts too
        required: false
    },
    // CHANGE: Add projectId field to support project contact interactions
    projectId: {
        type: String,
        required: false
    },
    ownerPhone: String,
    // CHANGE: Add builderPhone field for project contacts
    builderPhone: String,
    contactType: {
        type: String,
        enum: ['CALL', 'WHATSAPP', 'CHAT'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['INITIATED', 'CONNECTED', 'FAILED', 'NO_RESPONSE', 'Pending', 'Viewed', 'Scheduled', 'Visited', 'Negotiating', 'Closed'],
        default: 'INITIATED'
    },
    duration: Number,
    notes: String,
    // CHANGE: Add entityType to distinguish between property and project contacts
    entityType: {
        type: String,
        enum: ['PROPERTY', 'PROJECT'],
        required: true
    }
});
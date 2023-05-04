const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const savedVenueSchema = new Schema({
    userId: { type: ObjectId, required: true, ref: 'user' },
    venueId: { type: ObjectId, required: true, ref: 'venue' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("savedvenue", savedVenueSchema)
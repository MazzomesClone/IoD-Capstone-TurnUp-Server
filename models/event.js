const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const eventSchema = new Schema({
    venueId: { type: ObjectId, required: true, ref: 'venue' },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, trim: true },
    primaryImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("event", eventSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const eventUpdateSchema = new Schema({
    eventId: { type: ObjectId, required: true, ref: 'event' },
    postBody: { type: String, trim: true },
    primaryImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("eventUpdate", eventUpdateSchema)
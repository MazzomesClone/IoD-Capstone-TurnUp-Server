const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const savedEventSchema = new Schema({
    userId: { type: ObjectId, required: true, ref: 'user' },
    eventId: { type: ObjectId, required: true, ref: 'event' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("savedevent", savedEventSchema)
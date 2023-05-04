const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const eventDiscussionSchema = new Schema({
    eventId: { type: ObjectId, required: true, ref: 'event' },
    userId: { type: ObjectId, required: true, ref: 'user' },
    postBody: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("eventDiscussion", eventDiscussionSchema)
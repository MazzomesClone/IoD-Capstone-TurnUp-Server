const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types

const venueSchema = new Schema({
    placeId: { type: String, trim: true, required: true, unique: true, immutable: true },
    ownerUserId: { type: ObjectId, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true, required: true, immutable: true },
    addressArray: { type: Array, required: true, immutable: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    website: { type: String, trim: true },
    primaryImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("venue", venueSchema)
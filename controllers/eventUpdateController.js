const { EventUpdate, Event } = require('../models')

async function getEventUpdates(req, res) {
    const { id: eventId } = req.params

    try {
        const eventUpdates = await EventUpdate.find({ eventId })
        res.status(200).json(eventUpdates)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function createEventUpdate(req, res) {
    const { userId } = req.user
    const { id: eventId } = req.params
    const newUpdateData = req.body.data

    try {
        const { venueId } = await Event.findById(eventId).populate('venueId', ['ownerUserId'])
        if (venueId.ownerUserId.toString() !== userId) return res.status(403).json({ message: 'User does not host event and cannot make updates' })

        newUpdateData.eventId = eventId

        if (req.file) {
            const { destination, filename } = req.file
            newUpdateData.primaryImage = encodeURI('/' + destination + filename)
        }

        await new EventUpdate(newUpdateData).save()
        res.status(200).json({ message: 'Update created successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function deleteEventUpdate(req, res) {
    const { userId } = req.user
    const { id: updateId } = req.params

    try {
        const { eventId, primaryImage } = await EventUpdate.findById(updateId)

        const { venueId } = await Event.findById(eventId).populate('venueId', ['ownerUserId'])
        if (venueId.ownerUserId.toString() !== userId) return res.status(403).json({ message: 'User does not host event and cannot delete updates' })

        await EventUpdate.findByIdAndDelete(updateId)
        res.status(200).json({ message: 'Event update deleted successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    createEventUpdate,
    getEventUpdates,
    deleteEventUpdate
}
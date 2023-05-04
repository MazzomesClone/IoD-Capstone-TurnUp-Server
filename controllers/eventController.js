const { Event, Venue, SavedEvent, EventDiscussion, EventUpdate } = require('../models')

async function getEvents(req, res) {
    try {
        const allEventsData = await Event.find({
            endDate: { $gt: new Date() }
        })
            .sort({ date: 1 })
            .populate('venueId')
        res.status(200).json(allEventsData)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function createEvent(req, res) {
    const newEventData = req.body.data
    const { userId } = req.user

    try {
        const venue = await Venue.findById(newEventData.venueId)
        if (!venue) return res.status(400).json({ message: 'Invalid Venue ID' })
        if (venue.ownerUserId.toString() !== userId) return res.status(403).json({ message: 'User is not the owner of this Venue' })

        if (req.file) {
            const { destination, filename } = req.file
            newEventData.primaryImage = encodeURI('/' + destination + filename)
        }

        const createdEvent = await new Event(newEventData).save()
        res.status(201).json({ message: 'Event created successfully', newId: createdEvent._id })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function editEvent(req, res) {
    const { userId } = req.user
    const { id: eventIdToEdit } = req.params
    const updatedEventData = req.body.data

    try {
        const eventToEdit = await Event.findById(eventIdToEdit).populate('venueId', 'ownerUserId')
        if (!eventIdToEdit) return res.status(400).json({ message: 'Invalid Event ID' })

        const venue = await Venue.findById(updatedEventData.venueId)
        if (!venue) return res.status(400).json({ message: 'Updated Venue ID is invalid' })

        if (eventToEdit.venueId.ownerUserId.toString() !== userId) return res.status(403).json({ message: 'User is not the owner of the venue and cannot edit event' })

        if (req.file) {
            const { destination, filename } = req.file
            updatedEventData.primaryImage = encodeURI('/' + destination + filename)
        }

        await Event.findByIdAndUpdate(eventIdToEdit, updatedEventData)
        res.status(200).json({ message: 'Event edited successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function deleteEvent(req, res) {
    const { id: eventIdToDelete } = req.params
    const { userId } = req.user

    try {
        const eventToDelete = await Event.findById(eventIdToDelete).populate('venueId', 'ownerUserId')
        if (!eventIdToDelete) return res.status(400).json({ message: 'Invalid Event ID' })

        if (eventToDelete.venueId.ownerUserId.toString() !== userId) return res.status(403).json({ message: 'User is not the owner of the venue and cannot delete event' })

        await Event.findByIdAndDelete(eventIdToDelete)
        await SavedEvent.deleteMany({ eventId: eventIdToDelete })
        await EventDiscussion.deleteMany({ eventId: eventIdToDelete })
        await EventUpdate.deleteMany({ eventId: eventIdToDelete })
        res.status(200).json({ message: 'Event deleted successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function saveEventForUser(req, res) {
    const { id: eventIdToSave } = req.params
    const { userId } = req.user

    try {
        const eventResult = await Event.findById(eventIdToSave)
        if (!eventResult) return res.status(400).json({ message: "Invalid Event ID" })

        const newSavedEventData = {
            userId,
            eventId: eventIdToSave
        }

        const existingSavedEvent = await SavedEvent.findOne(newSavedEventData)
        if (existingSavedEvent) return res.sendStatus(304)

        await new SavedEvent(newSavedEventData).save()
        res.status(200).json({ message: "Event saved successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function unsaveEventForUser(req, res) {
    const { id: eventIdToUnsave } = req.params
    const { userId } = req.user

    try {
        const result = await SavedEvent.findOneAndDelete({ userId, eventId: eventIdToUnsave })
        res.status((result) ? 200 : 304).json({ message: "Unsaved event successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function getSavedEventsForUser(req, res) {
    const { userId } = req.user

    try {
        const savedEventsForUserRAW = await SavedEvent.find({ userId })
            .sort({ date: 1 })
            .populate({
                path: 'eventId',
                populate: {
                    path: 'venueId'
                }
            })
        const savedEventsForUser = savedEventsForUserRAW.map(({ eventId: event }) => event)
        res.status(200).json(savedEventsForUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function getEventPageData(req, res) {
    const { id: eventId } = req.params

    try {
        const eventData = await Event.findById(eventId).populate('venueId', ['name', 'address', 'addressArray', 'placeId', 'ownerUserId'])
        if (!eventData) return res.status(404).json({ message: 'Invalid Event ID' })

        const usersThatSavedRAW = await SavedEvent.find({ eventId }).populate('userId', ['firstName', 'lastName', 'pfp'])
        const usersThatSaved = usersThatSavedRAW.map(({ userId: user }) => user)

        const eventPageData = {
            ...eventData.toJSON(),
            usersThatSaved
        }

        res.status(200).json(eventPageData)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function getEventsHostedByVenue(req, res) {
    const { id: venueId } = req.params

    try {
        const eventsHostedByVenue = await Event.find({
            endDate: { $gt: new Date() },
            venueId: venueId
        })
            .sort({ date: 1 })
            .populate('venueId')
        res.status(200).json(eventsHostedByVenue)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function getAllEventsHostedByUser(req, res) {
    const { userId } = req.user

    try {
        // This is not a good solution but it gets the feature working
        const allEvents = await Event.find({}).sort({ date: 1 }).populate('venueId')

        const eventsHostedByUser = allEvents.filter(({ venueId }) => venueId.ownerUserId.toString() === userId)

        res.status(200).json(eventsHostedByUser)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getEvents,
    createEvent,
    editEvent,
    deleteEvent,
    saveEventForUser,
    unsaveEventForUser,
    getSavedEventsForUser,
    getEventPageData,
    getEventsHostedByVenue,
    getAllEventsHostedByUser
}
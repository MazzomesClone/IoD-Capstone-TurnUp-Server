const { Venue, SavedVenue, Event, EventDiscussion, SavedEvent, EventUpdate } = require('../models')

async function getVenues(req, res) {
    try {
        const allVenuesData = await Venue.find({})
        const recentlyCreatedFirst = allVenuesData.sort((a, b) => b.createdAt - a.createdAt)
        res.status(200).json(recentlyCreatedFirst)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function registerVenue(req, res) {
    const newVenueData = req.body.data
    const ownerUserId = req.user.userId

    try {
        const existingVenue = await Venue.findOne({ placeId: newVenueData.placeId })
        if (existingVenue) return res.status(409).json({ message: "Venue already exists" })

        const newVenue = {
            ownerUserId,
            ...newVenueData
        }

        if (req.file) {
            const { destination, filename } = req.file
            newVenue.primaryImage = encodeURI('/' + destination + filename)
        }

        const createdVenue = await new Venue(newVenue).save()
        res.status(201).json({ message: "Venue registered successfully", newId: createdVenue._id })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function editVenue(req, res) {
    const { id: venueIdToEdit } = req.params
    const updatedVenueData = req.body.data
    const { userId } = req.user

    try {
        const { ownerUserId } = await Venue.findById(venueIdToEdit)
        if (ownerUserId.toString() !== userId) return res.status(403).json({ message: "User is not the owner of this venue" })

        if (req.file) {
            const { destination, filename } = req.file
            updatedVenueData.primaryImage = encodeURI('/' + destination + filename)
        }

        await Venue.findByIdAndUpdate(venueIdToEdit, updatedVenueData)
        res.status(200).json({ message: "Venue edited successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function deleteVenue(req, res) {
    const { id: venueIdToDelete } = req.params
    const { userId } = req.user

    try {
        const { ownerUserId } = await Venue.findById(venueIdToDelete)
        if (ownerUserId.toString() !== userId) return res.status(403).json({ message: "User is not the owner of this venue" })

        const allEventsAtVenue = await Event.find({ venueId: venueIdToDelete })

        allEventsAtVenue.forEach(async ({ _id }) => {
            await EventDiscussion.deleteMany({ eventId: _id })
            await SavedEvent.deleteMany({ eventId: _id })
            await EventUpdate.deleteMany({ eventId: _id })
        })

        await Event.deleteMany({ venueId: venueIdToDelete })
        await SavedVenue.deleteMany({ venueId: venueIdToDelete })
        await Venue.findByIdAndDelete(venueIdToDelete)
        res.status(200).json({ message: 'Venue deleted successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function saveVenueForUser(req, res) {
    const { id: venueIdToSave } = req.params
    const { userId } = req.user

    try {
        const venueResult = await Venue.findById(venueIdToSave)
        if (!venueResult) return res.status(400).json({ message: "Invalid Venue ID" })

        const newSavedVenueData = {
            userId,
            venueId: venueIdToSave
        }

        const existingSavedVenue = await SavedVenue.findOne(newSavedVenueData)
        if (existingSavedVenue) return res.sendStatus(304)

        await new SavedVenue(newSavedVenueData).save()
        res.status(200).json({ message: "Venue saved successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function unsaveVenueForUser(req, res) {
    const { id: venueIdToUnsave } = req.params
    const { userId } = req.user

    try {
        const result = await SavedVenue.findOneAndDelete({ userId, venueId: venueIdToUnsave })
        res.status((result) ? 200 : 304).json({ message: "Unsaved venue successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function getSavedVenuesForUser(req, res) {
    const { userId } = req.user

    try {
        const savedVenuesForUserRAW = await SavedVenue.find({ userId }).populate('venueId')
        const savedVenuesForUser = savedVenuesForUserRAW.map(({ venueId: venue }) => venue)
        res.status(200).json(savedVenuesForUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function getVenuePageData(req, res) {
    const { id: venueId } = req.params

    try {
        const venueData = await Venue.findById(venueId)
        if (!venueData) return res.status(400).json({ message: "Invalid Venue ID" })

        const usersThatSavedRAW = await SavedVenue.find({ venueId }).populate('userId', ['firstName', 'lastName', 'pfp'])
        const usersThatSaved = usersThatSavedRAW.map(({ userId: user }) => user)

        const venuePageData = {
            ...venueData.toJSON(),
            usersThatSaved
        }

        res.status(200).json(venuePageData)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function checkDuplicateVenue(req, res) {
    const { id: placeId } = req.params

    try {
        const existingVenue = await Venue.findOne({ placeId })
        if (existingVenue) return res.status(409).json({ message: "Venue already exists" })

        res.status(200).json({ message: "This venue does has not been registered" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function getOwnedVenuesForUser(req, res) {
    const { userId } = req.user

    try {
        const ownedVenues = await Venue.find({ ownerUserId: userId })
        res.status(200).json(ownedVenues)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getVenues,
    registerVenue,
    editVenue,
    deleteVenue,
    saveVenueForUser,
    unsaveVenueForUser,
    getSavedVenuesForUser,
    getVenuePageData,
    checkDuplicateVenue,
    getOwnedVenuesForUser
}
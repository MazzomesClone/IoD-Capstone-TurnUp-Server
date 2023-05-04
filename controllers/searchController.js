const { Event, Venue } = require('../models')

async function retrieveBySearchQuery(req, res) {
    const { query } = req.params
    const searchExpression = new RegExp(query, 'i')

    try {
        const eventResultPromise = Event.find({
            $or: [
                { name: searchExpression }
            ],
            endDate: { $gt: new Date() }
        })

        const venueResultPromise = Venue.find({
            $or: [
                { name: searchExpression }
            ]
        })

        const rawResults = await Promise.all([eventResultPromise, venueResultPromise])
        const compiledResults = rawResults.flat()

        res.status(200).json(compiledResults)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    retrieveBySearchQuery
}
const { EventDiscussion } = require('../models')

async function getEventDiscussion(req, res) {
    const { id: eventId } = req.params

    try {
        const eventDiscussion = await EventDiscussion.find({ eventId }).populate('userId', ['firstName', 'lastName', 'pfp'])
        const dateAscending = eventDiscussion.sort((a, b) => b.createdAt - a.createdAt)
        res.status(200).json(dateAscending)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function createEventDiscussionPost(req, res) {
    const postData = req.body
    const { userId } = req.user

    try {

        postData.userId = userId

        await new EventDiscussion(postData).save()
        res.status(200).json({ message: "Successfully created discussion post" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function deleteEventDiscussionPost(req, res) {
    const { id: discussionIdToDelete } = req.params
    const { userId } = req.user

    try {
        const discussionToDelete = await EventDiscussion.findById(discussionIdToDelete)
        if (discussionToDelete.userId.toString() !== userId) return res.status(403).json({ message: 'User did not make this post' })

        await EventDiscussion.findByIdAndDelete(discussionIdToDelete)
        res.status(200).json({ message: 'Discussion post deleted successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getEventDiscussion,
    createEventDiscussionPost,
    deleteEventDiscussionPost
}
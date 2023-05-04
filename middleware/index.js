const jwt = require('jsonwebtoken')
const multer = require('multer')

function authenticateToken(req, res, next) {

    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "Authorisation failed" })

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Authentication failed" })
        req.user = user
        next()
    })
}

const userStorage = multer.diskStorage({
    destination: 'public/images/users/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const venueStorage = multer.diskStorage({
    destination: 'public/images/venues/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const eventStorage = multer.diskStorage({
    destination: 'public/images/events/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const eventUpdateStorage = multer.diskStorage({
    destination: 'public/images/events/updates/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const uploadUserPFPFile = multer({ storage: userStorage }).single("file")

const uploadVenueFile = multer({ storage: venueStorage }).single("file")

const uploadEventFile = multer({ storage: eventStorage }).single("file")

const uploadEventUpdateFile = multer({ storage: eventUpdateStorage }).single("file")

module.exports = {
    authenticateToken,
    uploadUserPFPFile,
    uploadVenueFile,
    uploadEventFile,
    uploadEventUpdateFile
}
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

require('dotenv').config()
require('./dbConnect')

const PORT = process.env.PORT
const appName = "TurnUp"

const userRoutes = require('./routes/userRoutes')
const venueRoutes = require('./routes/venueRoutes')
const eventRoutes = require('./routes/eventRoutes')
const searchRoutes = require('./routes/searchRoutes')

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send({ message: `Welcome to ${appName}` })
})

app.use("/public", express.static("public"));
app.use('/api/users', userRoutes)
app.use('/api/venues', venueRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/search', searchRoutes)

app.listen(PORT, () => {
    console.log('TurnUp Started')
    console.log('Server listening on port ' + PORT)
})

module.exports = app
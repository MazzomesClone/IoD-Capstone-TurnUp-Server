const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const COOKIE_NAME = 'token'
const VERIFY_TIMEOUT = 1000 * 60     //60 Secs
const AUTH_EXPIRY = 1000 * 60 * 60 * 24 * 30     // 30 Days

function createToken(user, remember, expiresIn) {
    const token = jwt.sign(
        {
            userId: user._id,
            remember
        },
        process.env.JWT_KEY,
        { expiresIn }
    )
    return token
}

async function getUser(req, res) {

    const { id: userId } = req.params

    try {
        const { firstName, lastName } = await User.findById(userId)
        res.status(200).json({ firstName, lastName })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

async function loginUser(req, res) {
    const { email, password, remember } = req.body

    try {
        if (!(email && password)) {
            res.status(401).json({ message: "Missing credentials" })
            return
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false

        if (!isPasswordCorrect) return res.status(403).json({ message: "Invalid credentials" })

        const token = createToken(user, remember, VERIFY_TIMEOUT)

        res.status(200)
            .cookie(COOKIE_NAME, token, { httpOnly: true, maxAge: VERIFY_TIMEOUT })
            .json({ message: 'Successfully logged in' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function editUser(req, res) {
    const { userId } = req.user
    const updatedUserData = req.body.data

    try {

        if (req.file) {
            const { destination, filename } = req.file
            updatedUserData.pfp = encodeURI('/' + destination + filename)
        }

        await User.findByIdAndUpdate(userId, updatedUserData)
        res.status(200).json({ message: 'User edited successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function registerUser(req, res) {
    const { firstName, lastName, email, password } = req.body

    try {

        if (!(email && password && firstName && lastName)) {
            res.status(400).json({ message: "Missing registration fields" });
            return
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(409).json({ message: "An account already exists with this email" })
            return
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        const newUser = {
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword
        }

        await new User(newUser).save()

        res.status(201).json({ message: 'New user successfully registered' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

async function verifyUser(req, res) {
    const { userId, remember } = req.user

    try {
        const user = await User.findOne({ _id: userId })
        user.password = undefined
        const renewedToken = createToken(user, remember, AUTH_EXPIRY)

        res.status(200)
            .cookie(COOKIE_NAME, renewedToken, { httpOnly: true, maxAge: (remember) ? AUTH_EXPIRY : undefined })
            .json(user)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

function logoutUser(req, res) {
    try {
        res.status(200)
            .cookie(COOKIE_NAME, undefined, { httpOnly: true, maxAge: -1 })
            .json({ message: 'Successfully logged out' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getUser,
    registerUser,
    loginUser,
    editUser,
    verifyUser,
    logoutUser
}
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {

    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "Authorisation failed" })

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Authentication failed" })
        req.user = user
        next()
    })
}

module.exports = authenticateToken
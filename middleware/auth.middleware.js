const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        jwt.verify(token, 'masai', (err, decoded) => {
            if (decoded) {
                req.body.username = decoded.username;
                req.body.userID = decoded.userID
                next();
            }
            else {
                res.status(400).send({ "error": "You are not authorized" })
            }
        });

    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
}
module.exports = {
    auth
}
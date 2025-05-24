const jwt = require('jsonwebtoken');
require("dotenv").config();

const tokenVerifyMiddeware = ((req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            req.decodedData = decoded;
            next();
        }
    }
    catch(error)
    {
        return res.json({"message":'Invalid token.',"error":true});
    }
});

module.exports = {
    tokenVerifyMiddeware
};
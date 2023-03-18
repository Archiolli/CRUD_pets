const jwt = require('jsonwebtoken')
const getToken = require('./get-token')
//middlewate pra validar o token



const checkToken = (req, res, next) => {

    const token = getToken(req)

    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Acesso Negado!" })
    }

    if (!token) {
        return res.status(201).json({ message: "Acesso negado" })
    }

    try {
        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" })
    }
    

}

module.exports = checkToken
const jwt = require('jsonwebtoken')
const { create } = require('../models/Pet')

const createUserToken = async(user, req, res) => {

    //cria um toke, e passa oq vai ser enviado, como por exemplo o id do usuario
    const token = jwt.sign({
        name: user.name,
        id: user._id      
    }, "nossosecret")//como segundo parametro, passamos uma forma de deixar o token unico aconselhevel colocar string complexas

    res.status(200).json({message: 'Você está logado', token: token, userId: user._id})
    //return token

}

module.exports = createUserToken
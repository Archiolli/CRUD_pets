const jwt = require("jsonwebtoken");
const User = require("../models/User");

//pegando o usuario pelo token
const getUserByToken = async (token) => {

    //se nao chegar o token o acessao é bloqueado 
    if(!token){
        return res.status(401).json({message: `Acesso negado!`})
    }

  const decoded = jwt.verify(token, "nossosecret");

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserByToken

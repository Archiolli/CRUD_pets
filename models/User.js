const mongoose = require('../db/conn')

const { Schema } = mongoose


const User = mongoose.model(
    'User',
    new Schema({
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            requires: true,
        },
        image:{
            type: String,
        },
        phone:{
            type: String,
            required: true,
        }
    },
    {timestamps: true},//cria duas colunas novas criatedAt e UpdatedAt (quando o dado foi criado a atualizado automaticamente)   
    
    
    ),
)

module.exports = User
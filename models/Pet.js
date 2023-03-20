const mongoose = require('../db/conn')

const { Schema } = mongoose


const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            requires: true,
        },
        weight: {
            type: Number,
            requires: true,
        },
        color: {
            type: String,
            requires: true,
        },
        image: {
            type: Array,
            required: true,
        },
        available: {
            type: Boolean
        },
        user: Object,
        adopter: Object
    },
        { timestamps: true },//cria duas colunas novas criatedAt e UpdatedAt (quando o dado foi criado a atualizado automaticamente)   


    ),
)

module.exports = Pet;
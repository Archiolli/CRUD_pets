//conexão com o banco 


const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://joao:UV5eKhOdYFEPFgp9@cluster0.o45wjnb.mongodb.net/?retryWrites=true&w=majority')
    console.log("Conectou ao mongoose");
}


main().catch((err) => console.log(err))

module.exports = mongoose;
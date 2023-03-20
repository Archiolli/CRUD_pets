//conexão com o banco 


const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://joaoarchiolli:Arko77imrk1.@cluster0.6y7pbvw.mongodb.net/?retryWrites=true&w=majority')
    console.log("Conectou ao mongoose");
}


main().catch((err) => console.log(err))

module.exports = mongoose;
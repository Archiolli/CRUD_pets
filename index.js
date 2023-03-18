const express = require('express') //framework
const cors = require('cors') //ponto inicial no arquivo (midware)

const app  = express()
//config JSON response 
app.use(express.json())

//resolvendo o problema do cors  libera o cors pra acessar a API
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

//public folder  pasta publica do prjeto
app.use(express.static('public'))

//Rotas de usuarios
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

//routes rotas de acesso da api que vao vir dos arquivos de routes
app.listen(5000)




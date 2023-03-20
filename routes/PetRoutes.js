const router = require("express").Router();

const PetController = require("../controllers/PetController");

//middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");
const Pet = require("../models/Pet");

router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  PetController.create
);

//rotas get

//pegando todos os usuarios
router.get('/', PetController.getAll)
//pegando os pets que eu cadastrei
router.get('/mypets', verifyToken, PetController.getAllUserPets) 
//pegando os pets que o user quer adotar
router.get('myadoptions', verifyToken, PetController.getAllUserAdoptions) 
//acessar os detalhes de cada pet individualmente
router.get('/:id', PetController.getPetById)

//rotas de atualização de pet
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
//rotas delete
router.delete('/:id', verifyToken, PetController.removePetById)


//rota de agendamento de visitas
router.patch('/schedule/:id', verifyToken, PetController.schedule)
//conclusão da operação
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router;

const Pet = require("../models/Pet");

//helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PerController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;

    const available = true;

    //upload de imagens imagens

    //validações
    if (!name) {
      res.status(422).json({ message: "Nome é obrigatório" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "Idade é obriatória" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "Peso é obrigatório" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "Cor é obrigatória" });
      return;
    }

    if (images.lenght === 0) {
      res.status(422).json({ message: "Imagem é obrigatória" });
      return;
    }
    //Fim das validações

    //pegando o dono do pet
    const token = getToken(req);
    const user = await getUserByToken(token);
    //criando o pet
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });
    images.map((image) => {
      //jogando um novo nome pras imagens
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save;
      res.status(201).json({ message: "Pet criado com sucesso" });
      newPet;
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt"); //ordenar os mais novos

    res.status(200).json({ pets: pets });
  }

  static async getAllUserPets(req, res) {
    //pegando o usuario pelo token

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({ pets });
  }

  static async getAllUserAdoptions(req, res) {

    
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({ pets });

  }

  static async getPetById(req, res){

    const id = req.params.id


    if(!ObjectId.isValid(id)){
      res.status(422).json({message: "ID inválido!"})
      return;
    }
    
    const pet = await Pet.findOne({_id: id})

    if(!pet){
      res.status(404).json({message: 'Pet inexistente!'})
    }

    




  }
};

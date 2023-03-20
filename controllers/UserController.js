const User = require("../models/Pet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//helpers
const getUserByToken = require("../helpers/get-user-by-token");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const { findOneAndUpdate } = require("../models/User");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória" });
      return;
    }

    if (password !== confirmpassword) {
      req.status(422).json({
        message: "As senhas são incompativeis, confira se são iguais!",
      });
      return;
    }
    //checando se o usuario existe

    const userExistes = await User.findOne({ email: email }); //percorre o banco pra ver se tem um email igual

    //validação em si
    if (userExistes) {
      res.status(422).json({ message: "Utilize outro email!" });
      return;
    }
    //criando a senha e emcryptando
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt); //senha cryptografada

    //criando o usuario

    const user = new User({
      nema: name,
      email: email,
      phone: phone,
      password: passwordHash,
    });
    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      req.status(500).json({ message: error });
    }
  }

  //criando o login
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    const user = await User.findOne({ email: email }); //percorre o banco pra ver se tem um email igual

    //validação em si
    if (!user) {
      res
        .status(422)
        .json({ message: "Nenhum usuário cadastrado com este email" });
      return;
    }

    //valida se a senha digitada é igual a cadastrada no banco
    const checkPassword = await bcrypt.compare(password, user.password); //compara as senhas e ve se batem

    if (!checkPassword) {
      res.status(422).json({ message: "Senha incorreta!" });
    }

    await createUserToken(user, req, res);
  }
  //pega o usuario que ta usando o sistema
  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      //chama outro helper pra poder extrair o token e pegar o usuario
      const token = getToken(req);
      const decoded = jwt.vetify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  //Pegando o usuario pelo id
  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({ user });
  }
  //atualizaçãao  de usuario
  static async editUser(req, res) {
    //check se o user existe
    const token = getToken(req);
    const user = await getUserByToken(token);

    const id = req.params.id;
    const { name, email, phone, password, confirmpassword } = req.body;

    let image = "";
    
    if(req.file){
        user.image = req.file.filename//multer ja altera o nome da imagem na req, como ele é um didleware, ja está configurado
    }


    //validações
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    //check se o email ja foi cadastrado
    const userExists = await User.findOne({ email: email }); //se o usuario existir com o email que foi enviado
    if (user.email !== email && userExists) {
      //enviou um email diferente mas ja está dastrado por outro usuario, validação pra nao sobreescrever
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }
    user.email = email;

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório" });
      return;
    }
    user.phone = phone;

    if (password !== confirmpassword) {
      req.status(422).json({
        message: "As senhas são incompativeis, confira se são iguais!",
      });
      return;
      //check se as senhas precisam ser alteradas
    } else if (password === confirmpassword && password != null) {
      //se o usuario enviou uma senha e elas forem iguais. Quer alterar a senha
      //criando uma nova senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash; //alterando a senha do usuário de fato
    }
    try {
      //retornando os dados atualiazdos sdo usuario
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: "Usuario atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: err });
      return;
    }

  }
};

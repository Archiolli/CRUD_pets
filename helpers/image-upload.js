const multer = require("multer");
const path = require("path");

//destino das imagens
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("pets")) {
      folder = "pets";
    }

    cb(null, `public/images/${folder}`);
  },
  filename: function (req, res, cb) {
    cb(null, Date.now() + String(Math.floor(Math.random() * 1000))  + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg$)$/)) {
      //quando encontrar o ponto, se nao encontrar um png uo jpeg ene entra no if
      return cb(
        new ErrorEvent("Por Favor, envia apenas arquivos .PNG ou .JPG")
      );
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };

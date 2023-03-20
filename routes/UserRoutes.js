const router = require("express").Router();

const UserController = require("../controllers/UserController");

//middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

//rotas POST
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/checkuser", UserController.checkUser);

//rotas GET
router.get("/:id", UserController.getUserById);

//rotas protegidas
router.patch("/edit/:id", verifyToken, imageUpload.single("image"), UserController.editUser); //analisa antes de passar pra frente





module.exports = router;

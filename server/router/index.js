const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const {body} = require("express-validator"); //для валидации тела запроса
const authMiddleware = require("../middleware/auth-middleware")

router.post("/registration", 
    body("email").isEmail(), //проверка на емейл
    body("password").isLength( {min:3, max: 32} ), //устанавливаем длинну пароля
    userController.registration
); //для регистрации
router.post("/login", userController.login); //для логина
router.post("/logout", userController.logout); //выйти и удаление рефрештокена из бд
router.get("/activate/:link", userController.activate); //активация аккаунта по ссылке, которая приходит на почту
router.get("/refresh", userController.refresh); // перезапись acsess токена, если он истек. И назад пара рефреш и акссес

router.get("/users",authMiddleware, userController.getUsers); //тестовый для авторизованных для получения списка юзеров

module.exports = router;
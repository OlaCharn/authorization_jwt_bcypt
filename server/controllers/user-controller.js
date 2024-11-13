//чтобы контроллер не был слишком объемным, всю логику выносим в service
const userService = require("../service/user-service");
const {validationResult} = require("express-validator");
const ApiError = require("../exceprions/api-error")

class UserController {

    async registration(req, res, next) {
        try{
            const errors = validationResult(req);//из него достанутся нужные поля и провалидируются по условию из index.js
            if(!errors.isEmpty()){ //есть ли что-то в ошибках валидации
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const { email, password } = req.body; 
            const userData = await userService.registration(email, password);
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 360 * 24 * 60 * 60 * 1000, httpOnly: true }); //храним рефрештокен 360дней в кукис 
            return res.json(userData); //отправляем на клиент

        } catch (e){
            next(e)
        }
    }
    async login(req, res, next) {
        try{
            const { email, password} = req.body;
            const userData = await userService.login(email, password); 
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 360 * 24 * 60 * 60 * 1000, httpOnly: true }); //храним рефрештокен 360дней в кукис 
            return res.json(userData); //отправляем на клиент

        } catch (e){
            next(e)

        }
    }

    async logout(req, res, next) {
        try{
            const {refreshToken} = req.cookies; //вытаскиваем из куки рефрешщтокен
            const token = await userService.logout(refreshToken); 
            res.clearCookie('refreshToken'); //убираем рефрештокен из куки
            return res.json(token);

        } catch (e){
            next(e)

        }
    }
    async activate(req, res, next) {
        try{
            const activationLink = req.params.link;  //из строки запроса получаем ссылку активации
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL); //так как скорее всего бэк и фронт будут на разных хостах, то редиректим на фронт

        } catch (e){
            next(e);
        }
    }
    async refresh(req, res, next) {
        try{
            //console.log('Cookies:', req.cookies); // Выводим куки для отладки
            const {refreshToken} = req.cookies; //вытаскиваем из куки рефрешщтокен
            const userData = await userService.refresh(refreshToken); //генерируем
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); //храним рефрештокен 360дней в кукис 
            return res.json(userData); //отправляем на клиент
        } catch (e){
            next(e);
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }



}
module.exports = new UserController();
const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceprions/api-error") //импортируем обработчик ошибок вместо дефолтных, которые у нас были

class UserService {
    async registration(email, password){
        const candidate = await UserModel.findOne( {email} ) //проверяем, если ли такой пользователь уже в базе. Проверяем по емейлу
        if (candidate) { //варианты кандидата для регистрации
            //throw new Error (`Пользователь почтовым адресом ${email} уже существует`) //если наш пользователь уже есть , то отдаем ошибку
            throw ApiError.BadRequest (`Пользователь почтовым адресом ${email} уже существует`) //если наш пользователь уже есть , то отдаем ошибку

        }
        const hashPassword = await bcrypt.hash(password, 3) //хэшируем пароль
        const activationLink = uuid.v4(); //uuid со своей функцией v4 возвращает нам рандомную строку чтобы сделать ссылку для активации
        const user = await UserModel.create({email, password: hashPassword , activationLink}) //если юзера нет, то создаем его в бд с хэщированным паролем
        await mailService.sendActivationMail(email,  `${process.env.API_URL}/api/activate/${activationLink}`); //отправляется письмо для активации нп почту юзера

        const userDto = new UserDto(user); //id, emeil, isActivated = используем как payload для отправки письма
        const tokens = tokenService.generateToken({...userDto}) //передаем userDto в качестве payload в генерацию токенов
        await tokenService.saveToken(userDto.id, tokens.refreshToken); //рефрештокен соxраняем в бд 

        return {...tokens, user: userDto}
        
    }
    //функция активации аккаунта по ссылке
    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink}) //ищем юзера в бд с таким activationLink
        if (!user) { //если юзера нет, то пробрасываем ошибку
            //throw new Error("Некорректная ссылка активации");
            throw ApiError.BadRequest("Некорректная ссылка активации");

        }
        //если же пользователь найдет с таким activationLink, то тогда меняем пользователя на isActivated
        user.isActivated = true;
        await user.save() //обновляем пользователя с новыми данными
    }

    async login(email, password){
        const user = await UserModel.findOne({email}); //ищем по емейлу в бд зарегистрированного пользователя
        if(!user){ //если пользователь не найден
            throw ApiError.BadRequest("Пользователь с таким email не найден");
        }
        //если пользователь найден, то сравниваем пароли
        //с помощью функции из bcrypt для сравнения паролей. Первый параметр - сам пароль, второй - из бд)
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){//если не совпал
            throw ApiError.BadRequest("Неверный пароль");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto}); //генерируем паоу токенов
        await tokenService.saveToken(userDto.id, tokens.refreshToken); //рефрештокен соxраняем в бд 

        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken); //удаляем из бо
        return token;
    }
    async refresh(refreshToken) {
        if (!refreshToken) { //если ошибка
            throw ApiError.UnauthorizedError(); //если токена у юзера нет, значит он не зарегистрирован
        }
        const userData = tokenService.validateRefreshToken(refreshToken); //пытаемся валидировать токен
        const tokenFromDb = await tokenService.findToken(refreshToken); //убеждаемся, что он в бю
        if (!userData || !tokenFromDb) { //и валидация и поиск неуспешно
            throw ApiError.UnauthorizedError();
        }
        //иначе генерируем новую пару токенов
        const user = await UserModel.findById(userData.id); //вытаскиваем пользователя
        const userDto = new UserDto(user); //обновляем по нему информацию
        const tokens = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find(); //возвращаем все записм
        return users;
    }


}
module.exports = new UserService();
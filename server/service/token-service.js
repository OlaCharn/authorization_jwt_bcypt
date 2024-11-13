//тут функция для генерации токена.
//payload - те данные, которые вшиваются в функцию

const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model")

class TokenService {
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCEESS_SECRET, {expiresIn: "30m"}) //наш access токен живет только 30 минут
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "360d"}) //наш рефреш токен живет 360дней
        return {
            accessToken,
            refreshToken
        }
    }
    //функции на валидацию токена
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCEESS_SECRET); 
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }


    //сохранение рефреш токена к конкреному юзеру в бд
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne( {userId}) //находим юзера по id
        
        if (tokenData) {  //если в бд нашли, то перезаписываем рефреш токен
            tokenData.refreshToken = refreshToken;
            return tokenData.save(); //обновляем рефреш токен в базе
        } //если условие не выполнилось, то юзер логинится в базе впервые и созаем его
        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData; 

    }

    //функция для поиска токена в бд
    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }

}
module.exports = new TokenService();
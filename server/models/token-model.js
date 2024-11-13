//тут храним id пользователя и refresh токен

const { Schema, model } = require("mongoose");

const TokenSchema = new Schema( {
    user: {type: Schema.Types.ObjectId, ref: "User"},//ссылка на пользователя
    refreshToken: {type: String, required: true},//рефреш токен. Он сохраняетмя в бд
})


module.exports = model("Token", TokenSchema);

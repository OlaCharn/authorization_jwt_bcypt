const { Schema, model } = require("mongoose");

const UserSchema = new Schema( {
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false}, //подтвердил юзер почту или нет. Если подтвердил, то станет true
    activationLink: {type: String}, //тут хранится ссылка для активации по почте
})

//экспортируем модель "User" на основании схемы
module.exports = model("User", UserSchema);
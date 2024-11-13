//этот middleware будет отвечать за обработку ошибок
const ApiError = require("../exceprions/api-error") //это то, где мы описали ошибки

module.exports = function(err, req, res, next) {
    console.log(err) //первым параметром обязательно принимает саму ошибку
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: "Непредвиденная ошибка"})
}
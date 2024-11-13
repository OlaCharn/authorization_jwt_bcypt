//тут у нас обработчик ошибок
//он расщиряет дефолтный js error

module.exports = class ApiError extends Error {
    status; //т.е. когда у нас будет ошщибка, то будет и ее http-статус 400 ..и тд
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    //используем статик функции. Статик функции - функции, которые можно исп. не создавая экземпляр класса
    //для неавторизованного
    static UnauthorizedError(){
        
        return new ApiError(401, "Пользователь не авторизован")
    }
    //для некорректных данных
    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }

}
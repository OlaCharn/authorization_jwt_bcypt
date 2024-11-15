
### `Authorization`

server - это backend. Стартует npm run dev
client - это frontend. Стартует npm start 

### `Принцип работы`

При логине создаются 2 токена: access token и refresh token.

access token хранится в LocalStorage и имеет недолгий срок действия.
refresh token хранится в сookies и имеет долгий срок действия.

Когда access token заканчивается в течение процесса, то с помощью refresh token генерируется новый, не выходя из авторизации.

При logout refresh token тоже удаляется из cookies.
refresh token хранится в MongoDB.

+ отдельная функция для зарегистрированного пользователя с доступом к бд.
+ отправка активационного письма на почту
+ обработка ошибок

### `ВАЖНО! для отправки почты с GMAIL`
SMTP_USER в файле .env это нашла почта. Если это почта gmail, то надо ОБЯЗАТЕЛЬНО 
1. Активировать в учетной записи двухэтапную аутентификацию, проверить почту и подтвердить.
2. Создать пароль приложения, все там же в настройках аккаунта, эта опция станет доступна после включения двухэтапной аутентификации, скопировать и вставить полученый в SMTP_PASSWORD

### Библиотеки

#### Backend Libraries

- **bcrypt**: для хэширования паролей
- **cookie-parser**: для сохранения refresh token в cookies
- **cors**: обработка запросов приложений, которые находятся на разных доменах
- **dotenv**: для работы с файлом среды
- **express**: фреймворк для Node.js
- **express-validator**: библиотека Express для валидации запросов на стороне сервера
- **jsonwebtoken**: генерация токенов
- **mongodb**: база данных
- **mongoose**: библиотека для работы с MongoDB в Node.js
- **nodemailer**: библиотека для отправки электронных писем
- **uuid**: библиотека для генерации случайных строк
- **nodemon**: инструмент для разработки, который автоматически перезапускает сервер Node.js при изменениях в файлах проекта

#### Frontend Libraries

- **axios**: библиотека для отправки HTTP запросов с клиентской или серверной стороны
- **mobx**: библиотека для управления состоянием
- **mobx-react-lite**: библиотека, предоставляющая интеграцию MobX с React для функциональных компонентов с меньшим объемом кода

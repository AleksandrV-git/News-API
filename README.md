# News-explorer-backend
Версия 0.0.1

## О проекте:
разработка сервера на NodeJS для дипломного проекта News-explorer.
В проекте предусмотрено добавление и удаление пользователями статей, а так же создание профиля пользователя.


## Основной функционал:
- Обработка, валидация запросов
- работа с базой данных MongoDB
- Аутентификация и авторизация пользователей

## Обрабатываемые запросы:
|ЗАПРОС|                        ОПИСАНИЕ|
|:----|:----------|
|GET /articles|	                  возвращает все сохранённые пользователем статьи|
|GET /users/me|	          возвращает информацию о пользователе (email и имя)|
|POST /articles|                   создаёт статью с переданными в теле keyword, title, text, date, source, link и image|
|DELETE /articles/articleId|         удаляет сохранённую статью  по _id|
|POST /signup|                  создаёт пользователя|
|POST /signin|                  авторизация пользователя|


## Стэк технологий:
NodeJS, express, REST API

## Пакеты которые используются в сборках:

  - "bcrypt": "5.0.0",
  - "body-parser": "1.19.0",
  - "celebrate": "13.0.3",
  - "cookie-parser": "1.4.5",
  - "cross-env": "7.0.2",
  - "dotenv": "8.2.0",
  - "express": "4.17.1",
  - "express-rate-limit": "5.1.3",
  - "express-winston": "4.0.5",
  - "jsonwebtoken": "8.5.1",
  - "mongoose": "5.10.7",
  - "mongoose-unique-validator": "2.0.3",
  - "validator": "13.1.17",
  - "winston": "3.3.3",
  - "eslint": "7.10.0",
  - "eslint-config-airbnb-base": "14.2.0",
  - "eslint-plugin-import": "2.22.0",
  - "nodemon": "2.0.4",
  - "helmet": "4.1.1"

## Инструкции по запуску:
- Скачать или склонировать репозиторий
- Установить NodeJS и MongoDB
- Установить зависимости при помощи npm - `npm i`
- Команда npm run start запускает сервер в production режиме на localhost:3000.
Для работы в в production режиме необходимо добавить .env файл с секретным ключом JWT_SECRET и записью NODE_ENV=production
- Команда npm run dev запускает сервер на localhost:3000 с хот релоудом

## Ссылка на сервер в Яндекс Облаке:
- URL
https://www.api.news-v.students.nomoreparties.co
- IP
130.193.56.255

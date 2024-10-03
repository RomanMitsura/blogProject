import express from "express"; //можно писать ES6 код благодаря "type": "module", в package.json
import jwt from "jsonwebtoken"; //импорт библиотеки jwt
import mongoose from "mongoose";

import second from "./validations/auth.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.63ays.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log(err + "DB error");
  });

const app = express(); // создание express приложения. Вся логика приложения в app

app.use(express.json()); //позволяет читать json который к нам приходит

//когда мне придет запрос на этот адресс "/auth/login" я хочу отловить запрос, вытащить запрос и ответ
app.post("/auth/register", (req, res) => {});

//запуск приложения по порту 4444. Функция для обработки ошибки
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server ok");
});

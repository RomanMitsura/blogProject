import express from "express"; //можно писать ES6 код благодаря "type": "module", в package.json
import jwt from "jsonwebtoken"; //импорт библиотеки jwt
import bcrypt from "bcrypt"; //импорт библиотеки bcrypt
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js"; //Импортируем модель пользователя

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.63ays.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
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
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req); //Проверяем ошибки из запроса (req)
    if (!errors.isEmpty()) {
      //Проверить если есть ошибки то вернуть статут 400 и все ошибки
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save(); //Создание пользователя. Резульатт вернувшийся от mongo db передается user

    res.json(user); //Возвращаем пользователю информацию о пользователе
  } catch (err) {}
});

//запуск приложения по порту 4444. Функция для обработки ошибки
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server ok");
});

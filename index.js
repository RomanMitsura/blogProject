import express from "express"; //можно писать ES6 код благодаря "type": "module", в package.json
import jwt from "jsonwebtoken"; //импорт библиотеки jwt
import bcrypt from "bcrypt"; //импорт библиотеки bcrypt
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js"; //Импортируем модель пользователя
// import { restart } from "nodemon";

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

//авторизация
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); //Поиск пользователя по признаку mail

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    ); //проверяет/сравнивает есть ли пароль который ввел
    //пользователь с тем что есть у нас в документе

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id, //шифруем
      },
      "secret123",
      { expiresIn: "30d" }
    );

    const { passwordHash, ...userData } = user._doc; //достаем passwordHash. Диструктуризация

    res.json({
      //возвращаем информацию о пользователе и сам токен
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось авторизоваться",
    });
  }
});

//когда мне придет запрос на этот адресс "/auth/login" я хочу отловить запрос, вытащить запрос и ответ
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    //Если все прошло успешно то возвращаем информацию о пользователе
    const errors = validationResult(req); //Проверяем ошибки из запроса (req)
    if (!errors.isEmpty()) {
      //Проверить если есть ошибки то вернуть статут 400 и все ошибки
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save(); //Создание пользователя. Резульатт вернувшийся от mongo db передается user

    const token = jwt.sign(
      {
        _id: user._id, //шифруем
      },
      "secret123",
      { expiresIn: "30d" }
    ); //Шифруем пользователя и добавляем время жизни (30 дней)

    const { passwordHash, ...userData } = user._doc; //достаем passwordHash. Диструктуризация

    res.json({
      //возвращаем информацию о пользователе и сам токен
      ...userData,
      token,
    }); //Возвращаем пользователю информацию о пользователе
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось зарегистривароться",
    });
  }
});

//запуск приложения по порту 4444. Функция для обработки ошибки
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server ok");
});

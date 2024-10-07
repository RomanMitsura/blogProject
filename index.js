import express from "express"; //можно писать ES6 код благодаря "type": "module", в package.json
import mongoose from "mongoose"; //Библиотека для лучшего взаимодействия с mongo db
import { registerValidation, loginValidation } from "./validations.js";
// import { restart } from "nodemon";
import checkAuth from "./utils/checkAuth.js"; //
// import User from "./models/User.js";
import * as UserController from "./controllers/UserController.js";

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
app.post("/auth/login", loginValidation, UserController.login);
//когда мне придет запрос на этот адресс "/auth/login" я хочу отловить запрос, вытащить запрос и ответ
app.post("/auth/register", registerValidation, UserController.register);
//проверка можем ли мы получить информацию о себе
app.get("/auth/me", checkAuth, UserController.getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});

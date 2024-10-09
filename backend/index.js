import express from "express"; //можно писать ES6 код благодаря "type": "module", в package.json
import mongoose from "mongoose"; //Библиотека для лучшего взаимодействия с mongo db
import multer from "multer";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
// import { restart } from "nodemon";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { UserController, PostContoller } from "./controllers/index.js";

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

//хранлище для картинок
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json()); //позволяет читать json который к нам приходит
app.use("/uploads", express.static("uploads"));
//Добавляем на путь /uploads что б экспресс проверял есть ли в папке то что мы передаем

//авторизация
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
//когда мне придет запрос на этот адресс "/auth/login" я хочу отловить запрос, вытащить запрос и ответ
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
//проверка можем ли мы получить информацию о себе
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostContoller.create
); //Создание статьи
app.get("/posts", PostContoller.getAll); //получение всех статей
app.get("/posts/:id", PostContoller.getOne); //Получение одной статьи
app.delete("/posts/:id", checkAuth, PostContoller.remove); //Удаление статьи
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  PostContoller.update
); //Редактирование статьи

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});

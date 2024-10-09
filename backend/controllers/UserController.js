//все разработанные функции
import jwt from "jsonwebtoken"; //импорт библиотеки jwt...Библиотека для создания токена пользователя
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js"; //Импортируем модель пользователя

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId); //При помощи finById вытащить этого пользователя по id

    //если такого пользователя нет то скажи нам об этом
    if (!user) {
      return res.status(404).json({
        message: "пользовательн не найден",
      });
    }

    //Если же пользователь есть то скажи нам об этом и верни информацию о нем
    const { passwordHash, ...userData } = user._doc; //достаем passwordHash. Диструктуризация

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

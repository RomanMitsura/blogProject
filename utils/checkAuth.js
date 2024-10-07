//Создание функции посредника (middleware).
//Функцйия будет решать можно ли пользователю получать информацию по этому токену

import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); //изымаем токен

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123"); //Декодирую токен по "кодовому" слову

      req.userId = decoded._id; //Заношу декодированный id в id запроса

      next();
    } catch (e) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};

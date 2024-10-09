import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req); //Проверяем ошибки из запроса (req)
  if (!errors.isEmpty()) {
    //Проверить если есть ошибки то вернуть статут 400 и все ошибки
    return res.status(400).json(errors.array());
  }

  next();
};

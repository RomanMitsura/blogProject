import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(), //если email коректный то пропускаем
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(), //если email коректный то пропускаем
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя (минимум 2 символа)").isLength({ min: 2 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(), //Опционально. Если не придет то ничего страшного,
  //если пришло то проверить URL ли это
];

export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(), //если email коректный то пропускаем
  body("text", "Введите текст статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(), //Опционально. Если не придет то ничего страшного,
  //если пришло то проверить URL ли это
];

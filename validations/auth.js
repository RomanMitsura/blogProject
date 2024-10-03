import { body } from "express-validator";

export const refisterValidation = [
  body("email").isEmail(), //если email коректный то пропускаем
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 2 }),
  body("avatarUrl").optional().isURL(), //Опционально. Если не придет то ничего страшного,
  //если пришло то проверить URL ли это
];

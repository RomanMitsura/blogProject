import mongoose from "mongoose";

//Создаем схему юзера со всеми свойствами
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      //Переменная котоаря хранит информацию о том что fullname - строка и
      //считается обязхательной при создании пользователя
      type: String,
      required: true,
    },
    email: {
      //Переменная котоаря хранит информацию о том что email - строка и
      //считается обязательной при создании пользователя и то что значение является уникальным
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      require: true,
    },
    avatarUrl: String,
  },
  {
    //Надо заносить время создания пользователя
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema); //Эскпорт схемы

import PostModel from "../models/Post.js";

//Создание статьи
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save(); //Создание документа

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось создать статью",
    });
  }
};

//Получение одной статьи
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; //достаем id статьи

    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } }, //Поиск статьи по id из postId и
      //увеличение просмотров на id через $inc : параметрКоторыйНадоУвеличить: 1
      { returnDocument: "After" }
    ) //Вернуть документ после обновления
      .then((doc) => res.json(doc))
      .catch((err) => res.status(500).json({ message: "Статья не найдена" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось получить статью",
    });
  }
};

//Получение всех статей
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec(); //наследование получаем все из user

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось получить статьи",
    });
  }
};

//Удалить статью
export const remove = async (req, res) => {
  try {
    const postId = req.params.id; //достаем id статьи

    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(500).json({
            message: " Не удалось найти статью",
          });
        }
        res.json({
          secess: true,
        });
      })
      .catch((err) => res.status(500).json({ message: "Статья не найдена!" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось получить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      succes: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: " Не удалось обновить статью",
    });
  }
};

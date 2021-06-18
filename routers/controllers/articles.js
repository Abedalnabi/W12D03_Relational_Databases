const articlesModel = require("./../../db/models/articles");
const connection = require("./../../db/db");

const getAllArticles = async (req, res) => {
  const query = `select * from articles`;
  const a = await connection.promise().query(query);
  res.json(a[0]);

  // articlesModel
  //   .find({})
  //   .then((result) => {
  //     res.status(200).json(result);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
};

const getArticlesByAuthor1 = async (req, res) => {
  const id = req.body.author;
  const dat = await connection.promise().query(`select * from users where firstName = ?`, [id]);
  const iid = dat[0][0].id;
  const join = `SELECT * FROM articles where author_id = ? `;
  const data = [iid];
  const a = await connection.promise().query(join, data);
  res.json(a[0]);
};
///////////////////// OR
const getArticlesByAuthor = async (req, res) => {
  const author = req.body.author;

  const joinFirstNameWithArticles = await connection
    .promise()
    .query(`SELECT firstName,title FROM users inner join articles ON users.id = articles.author_id;`);
  res.json(
    joinFirstNameWithArticles[0].filter((ele) => {
      return ele.firstName === author;
    })
  );
};

const getAnArticleById = (req, res) => {
  const _id = req.params.id;

  if (!_id) return res.status(404).json("not found");

  articlesModel
    .findOne({ _id })
    .populate("author", "firstName -_id")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

const createNewArticle = async (req, res) => {
  const { title, description } = req.body;

  const query = `insert into articles (title,description) VALUES (?,?)`;
  const data = [title, description];
  let dat = await connection.promise().query(query, data);
  res.json(dat);
};

const updateAnArticleById = async (req, res) => {
  const id = req.params.id;
  const { description, title } = req.body;

  await connection
    .promise()
    .query(`update articles SET title=? , description=? where id = ?`, [title, description, id]);

  const updated = await connection.promise().query(`select * from articles where id=?`, [id]);
  res.json(updated[0]);
};

const deleteArticleById = async (req, res) => {
  const id = req.params.id;
  await connection.promise().query(`UPDATE articles SET is_deleted=? WHERE id=?`, [1, id]);

  const deleted = await connection.promise().query(`select *  from articles WHERE is_deleted=? And id=?`, [1, id]);
  res.json(deleted[0]);
};

const deleteArticlesByAuthor = async (req, res) => {
  const author = req.body.author;

  const join = await connection
    .promise()
    .query(
      `SELECT title,description,firstName,author_id from users INNER JOIN articles ON users.id = articles.author_id`
    );
  /// now use join to get first name then use first name to get id for author then delete author id deleted =1
};

module.exports = {
  getAllArticles,
  getArticlesByAuthor,
  getAnArticleById,
  createNewArticle,
  updateAnArticleById,
  deleteArticleById,
  deleteArticlesByAuthor,
};

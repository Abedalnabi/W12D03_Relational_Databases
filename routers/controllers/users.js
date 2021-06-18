const usersModel = require("../../db/models/users");
const connection = require("./../../db/db");
const bcrypt = require("bcrypt");

const createNewAuthor = async (req, res) => {
  const { firstName, lastName, age, country, email, password, role_id } = req.body;
  bcryptPass = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (firstName,lastName,age,country,email,password,role_id) VALUES  (?,?,?,?,?,?,?)`;
  const data = [firstName, lastName, age, country, email, bcryptPass, role_id];
  connection.query(query, data, (err, results) => {
    res.json(results);
  });
};

module.exports = {
  createNewAuthor,
};

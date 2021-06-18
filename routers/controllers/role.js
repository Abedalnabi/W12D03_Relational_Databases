const roleModel = require("./../../db/models/role"); //mongodb
const mysql = require("mysql2");
const connection = require("../../db/db"); //mysql

const createNewRole = (req, res) => {
  const { role } = req.body;
  console.log("role", role);
  const query = `INSERT INTO roles (role) VALUES (?)`;

  const data = [role];

  connection.query(query, data, (err, results) => {
    res.json(results);
  });
};

module.exports = {
  createNewRole,
};

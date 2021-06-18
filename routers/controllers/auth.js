const usersModel = require("../../db/models/users");
const connection = require("./../../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  const query = `select * from users where email= ? `;
  const query2 = `select * from users where password= ? `;

  const data1 = [email];
  const data2 = [password];

  const emailcheck = await connection.promise().query(query, data1);
  if (!emailcheck[0][0]) return res.json("this email doesnt existe");

  console.log("emailcheck", emailcheck[0][0]);
  const valid = await bcrypt.compare(password, emailcheck[0][0].password);
  if (valid) {
    const payload = {
      userId: "user._id,",
      country: "user.country,",
      role: "user.role,",
    };

    const options = {
      expiresIn: "60m",
    };

    res.json(jwt.sign(payload, process.env.SECRET, options));
  }
  const passCheck = await connection.promise().query(query2, data2);
  if (!passCheck[0][0]) return res.json("this password incorrect");

  res.json(emailcheck[0]);
};

module.exports = {
  login,
};

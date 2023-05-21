// server.js
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user')

const express = require("express");
require("dotenv").config();

//CREATE EXPRESS APP
const app = express();
app.use(cors());

// Middleware
app.use("/api", userRoutes);
app.use(express.json());

// DECLARE JWT-secret
const JWT_Secret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send(`
  <div>
    <h1>👋 Hola</h1>
    <p>🔐 Si quieres un token haz un post a: <b>/api/authenticate</b></p>
    <p>- <b>Usuario</b>: user@user.com</p>
    <p>- <b>Password</b>: 1234</p>
  </div>
  `);
});

app.post("/api/authenticate", async (req, res) => {
  if (req.body) {
    let user = req.body;

    let response = await fetch(`http://localhost:${PORT}/api/users`);
    const testUsers = await response.json();
    
    let findUser = userExist(user, testUsers);

    if (findUser) {
      let token = jwt.sign(findUser, JWT_Secret);
      res.status(200).send({
        signed_user: {
          email: findUser.email,
          password: findUser.password,
          role: findUser.role,
        },
        token: token,
      });
    } else {
      res.status(403).send({
        errorMessage: "Authorisation required!",
      });
    }
  } else {
    res.status(403).send({
      errorMessage: "Please provide email and password",
    });
  }
});


function userExist(user, users) {
  return users.find(
    (u) => u.email === user.email && u.password === user.password
  );
}

// Mongo DB Conection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a Mongodb Atlas"))
  .catch((error) =>
    console.log(
      `Ha habido un error: ${error}`
    )
  );

app.listen(PORT, () => {
  console.log(`Servidor encendido en: PORT -> ${PORT}`);
 
});

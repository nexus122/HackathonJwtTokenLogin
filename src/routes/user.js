const express = require("express");
const userShema = require("../models/user");
const router = express.Router();
router.use(express.json());
// create user
router.post("/users", (req, res) => {
  const user = userShema(req.body);
  user
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

// get all users
router.get("/users", (req, res) => {
  userShema
    .find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

// get a user
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userShema
    .findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

// update a user
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  userShema
    .updateOne({_id:id}, { $set: {email, password}} )
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

// delete a user
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    userShema
      .deleteOne({_id: id})
      .then((data) => {
        res.json(data);
      })
      .catch((error) => res.json({ message: error }));
  });

module.exports = router;

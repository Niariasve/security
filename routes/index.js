var express = require('express');
var router = express.Router();

var crypto = require('crypto');

const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

/* GET home page. */
router.get('/', function(req, res) {

  res.render('login');
});

//POST
router.post('/login', async function(req, res) {

  let { username, password } = req.body;

  let user = await models.users.findOne({
    where: {
      name: username
    }
  })
  
  if (user != null) {

    try {
      let salt = process.env.SALT;
      let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
      let passwordHash = salt + "$" + hash;

      if (user.password === passwordHash) {
        const options = {
          expire: new Date(
            Date.now() + (60 * 1000)
          )
        }

        res.cookie("username", username, options)

        res.redirect("/users");
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  } else {
    res.redirect('/');
  }
})

module.exports = router;

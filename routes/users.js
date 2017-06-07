'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');

router.post('/users',(req,res,next) => {
  var hashpw = bcrypt.hashSync(req.body.password, 10);
  knex('users')
  .insert({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    hashed_password: hashpw
  }, ['id', 'first_name', 'last_name', 'email'])
  .then((data)=>{
    res.send(humps.camelizeKeys(data)[0])
  });
});




module.exports = router;

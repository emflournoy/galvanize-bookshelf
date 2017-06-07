'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const bcrypt = require('bcrypt');

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(cookieParser());


router.get('/token',(req,res,next) => {
  if (Object.keys(req.cookies).length === 0){
    res.status(200);
    return res.send(false);
  } else {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, decoded)=> {
      if(err) {
        res.error(400);
      } else {
        return res.send(true);
      }
    });
  }
});

router.post('/token',(req,res,next) => {
  knex('users')
  .where('email', req.body.email)
  .then((data)=>{
    let hashpw = data[0].hashed_password;
    let bcTest = bcrypt.compareSync(req.body.password, hashpw);
    if(bcTest === true){
      let userInfo = {
          id: data[0].id,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          email: data[0].email
        }
      let jwtoken = jwt.sign(userInfo, process.env.JWT_KEY);
      res.cookie('token', jwtoken, {httpOnly: true}).send(userInfo)
    } else {
      errRes(res, `Bad email or password`);
    }
  })
  .catch((error)=>{
    if(!req.body.email){
      errRes(res, 'Email must not be blank');
    } else if (!req.body.password) {
      errRes(res, 'Password must not be blank');
    } else {
      errRes(res, `Bad email or password`);
    }
  })
});

router.delete('/token',(req,res,next) => {
  if (Object.keys(req.body).length === 0){
    res.status(200);
    res.cookie('token', '', {httpOnly: true}).send()
  }
});



function errRes(res, phrase){
  return res.status(400)
  .set({'Content-Type': 'plain/text'})
  .send(phrase);
}





module.exports = router;

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const bcrypt = require('bcrypt');

// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');


router.use('/favorites', (req,res,next) => {jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, decoded)=> {
    if(err) {
      return res.status(401)
      .set({'Content-Type': 'plain/text'})
      .send('Unauthorized');
    } else {
      next();
    }
  })
});

router.get('/favorites',(req,res,next) => {
  knex('favorites')
  .innerJoin('books', 'favorites.book_id', 'books.id')
  .then((data)=>{
    res.send(humps.camelizeKeys(data))
  });
});

router.get('/favorites/check',(req,res,next) => {
  knex('favorites')
  .where('book_id', req.query.bookId)
  .then((data)=>{
    if(data.length>0){
      res.send(true);
    } else {
      res.send(false);
    }
  })
})

router.post('/favorites',(req,res,next) => {
  knex('favorites')
  .insert({book_id: req.body.bookId, user_id: 1}, '*')
  .then((data)=>{
    res.send(humps.camelizeKeys(data)[0])
  });
});

router.delete('/favorites', (req,res,next) => {
  knex('favorites')
  .where('book_id', req.body.bookId)
  .returning(['book_id','user_id'])
  .del()
  .then((data)=>{
    res.send(humps.camelizeKeys(data)[0])
  })
})



module.exports = router;

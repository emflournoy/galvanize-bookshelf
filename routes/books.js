'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

let booksArr = [];


router.get('/books',(req,res,next) => {
  knex('books').orderBy('title').then((data)=>{
    booksArr = humps.camelizeKeys(data)
    res.send(booksArr)
  });
});

router.get('/books/:id',(req,res,next) => {
  knex('books').where('id', req.params.id).then((data)=>{
    res.send(humps.camelizeKeys(data[0]))
  });
});

router.post('/books',(req,res,next) => {
  knex('books')
  .insert(humps.decamelizeKeys(req.body), '*')
  .then((data)=>{
    res.send(humps.camelizeKeys(data)[0])
  });
});


router.patch('/books/:id',(req,res,next) => {
  knex('books')
  .where('id', req.params.id)
  .update(humps.decamelizeKeys(req.body),'*')
  .then((data)=>{
    res.send(humps.camelizeKeys(data)[0])
  });
});


router.delete('/books/:id', (req, res, next)=> {
  // if(req.params.id >= booksArr.length||undefined){
  //   res.status(404)
  // }
  knex('books')
  .where('id', req.params.id)
  .returning('*')
  .del()
  .then((result)=> {
    result = humps.camelizeKeys(result);
    delete result[0].id;
    res.send(result[0]);
  }).catch((err)=> {
    console.error(err);
  });
});


//longer--------------

// router.post('/books', (req, res, next)=> {
//   knex('books')
//   .insert({
//     title: req.body.title,
//     author: req.body.author,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover_url:req.body.coverUrl
//   }, '*')
//   .then((result)=>{
//     result = humps.camelizeKeys(result);
//     res.send(result[0]);
//   })
//   .catch((err)=> {
//     console.error(err);
//   });
// });
//
// router.patch('/books/:id', (req, res, next)=>{
//   knex('books')
//   .where('id', req.params.id)
//   .update({
//     title: req.body.title,
//     author: req.body.author,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover_url:req.body.coverUrl
//   }, '*')
//   .then((result)=> {
//     result = humps.camelizeKeys(result);
//     res.send(result[0]);
//   }).catch((err)=> {
//     console.error(err);
//   })
// });
//
// router.delete('/books/:id', (req, res, next)=> {
//   knex('books')
//   .where('id', req.params.id)
//   .returning('*')
//   .del()
//   .then((result)=> {
//     result = humps.camelizeKeys(result);
//     delete result[0].id;
//     res.send(result[0]);
//   }).catch((err)=> {
//     console.error(err);
//   });
// });

module.exports = router;

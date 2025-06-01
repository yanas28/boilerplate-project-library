/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const connection = require('../connection');
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      connection.getBook(req, res);
  })
    
    .post(function (req, res){
      connection.postBook(req, res);
    })
    
    .delete(function(req, res){
     connection.deleteBook(req, res);
    });



  app.route('/api/books/:id')
    .get(function (req, res){
     connection.getBookWithId(req, res);
  })
    
    .post(function(req, res){
      connection.postBookWithId(req, res);
    })
    
    .delete(function(req, res){
     connection.deleteBookWithId(req, res);
    });
  
};

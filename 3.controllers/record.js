var userModel  = require('../1.models/user');
var recordModel  = require('../1.models/record');
var RecordTable = require('../1.models/record_table');

var async = require('async');
var mongoose = require('mongoose');
var { body, validationResult } = require('express-validator');

exports.select_all = (req, res) => {
    if(!req.isAuthenticated()){
        res.redirect("/user/login");
    };

    console.log('Get Select_All');

    console.log(req.user);
    console.log(req.query);

    let table_id = req.query.table_id;
    let title = req.query.title;

    async.parallel({
        user: function(callback){
            userModel.findById(req.user._id).exec(callback)
        },
        record_table: function(callback) {
            RecordTable.find({user: req.user._id}).exec(callback);
        },
        record: function(callback){
            recordModel.find({user: req.user._id, table: table_id}).exec(callback)
        }
    },
        function(err, results){
            if(err){throw err}
            let params = {
                _table: { 
                    _id: table_id,
                    _title: title
                },
                _user:results.user,
                _record_tables: results.record_table,
                _records:results.record,
              };

            console.log("Render Record page");
            console.log(params);

            res.render('record', params);
        });
}

// record table
exports.create_record_table = (req, res, next) => {
  if(!req.isAuthenticated()){
      res.redirect('/')
      return;
  }

  var errors = validationResult(req);
  if (!erros.isEmpty())
  {
    console.log('error accur');
    console.log(errors);
    res.redirect('/home');
    return;
  }

  const table = new recordTableModel({
    title : "",
    description : "",
    user : req.user._id
  });

  table.save((err)=>{
    if(err){
        throw err;
    }
    res.redirect('/home');
  });
}

// record
exports.edit_record = (req, res, next) => {
  body('title').trim().escape();
  body('description').trim().escape();
  var errors = validationResult(req);
  if(!req.isAuthenticated()){
      res.redirect('/')
  }
  else{
      if(errors.isEmpty()){
          recordModel.findByIdAndUpdate(req.body.id, {
              title: req.body.title,
              description: req.body.detail,
              date: req.body.date,
              time: req.body.time,
              collection: req.user._id
          },
          (err) => {
              if(err){
                  throw err;
              }
              res.redirect('/home');
          });
      }   
      else
      {
          console.log('error accur');
          console.log(errors);
          res.redirect('/home');
      }
  }
}

exports.create_record = (req, res, next)=>{
  body('subject').trim().escape();
  body('description').trim().escape();
  var errors = validationResult(req);
  if(!req.isAuthenticated()){
      res.redirect('/')
  }
  else{
      if(errors.isEmpty()){
        console.log('start create record model');        
          console.log(req.body);
          const record = new recordModel({
              table: req.body.table_id,
              subject: req.body.subject,
              date: req.body.date,
              description: req.body.detail,
              time: req.body.time
          })

          record.save((err)=>{
              if(err){
                  throw err;
              }
              res.redirect('/home');
          })
      }   
      else
      {
          console.log(errors);
          res.redirect('/home');
      }
  }
}

exports.record_delete = (req, res, next) => {
      recordModel.findByIdAndDelete(req.body.record_id).exec(function(err){
          if(err){throw err}
          res.redirect('/home')
      })
}
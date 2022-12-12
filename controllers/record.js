var express = require('express');
var userModel  = require('../models/user');
var recordModel  = require('../models/record');
var recordCollectionModel = require('../models/record_collection');

var async = require('async');
var mongoose = require('mongoose');
var { body, validationResult } = require('express-validator');

// record collection
exports.create_record_collection = (req, res, next) => {
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

  const collection = new recordCollectionModel({
    title : "",
    description : "",
    user : req.user._id
  });

  collection.save((err)=>{
    if(err){
        throw err;
    }
    res.redirect('/home');
  });
}

exports.delete_record_collection = (req, res, next) => {

}

exports.edit_record_collection = (req, res, next) => {

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
  body('title').trim().escape();
  body('description').trim().escape();
  var errors = validationResult(req);
  if(!req.isAuthenticated()){
      res.redirect('/')
  }
  else{
      if(errors.isEmpty()){
          console.log('start create record model');
          const record = new recordModel({
              title: req.body.title,
              description: req.body.detail,
              date: req.body.date,
              time: req.body.time,
              collection: req.user._id
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
      recordModel.findByIdAndDelete(req.body.record_name).exec(function(err){
          if(err){throw err}
          res.redirect('/home')
      })

}
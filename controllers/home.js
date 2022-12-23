var express = require('express');
var userModel  = require('../models/user');
var recordModel  = require('../models/record');
var async = require('async');
var mongoose = require('mongoose');
var { body, validationResult } = require('express-validator');


exports.home = (req, res)=>{
    if(!req.isAuthenticated()){
        res.redirect("/user/login");
        
    };
    async.parallel({
        user: function(callback){
            userModel.findById(req.user._id).exec(callback)
        },
        record: function(callback){
            recordModel.find({user: req.user._id}).exec(callback)
        }
    },
        function(err, results){
            if(err){throw err}
            //console.log(results.record);
            res.render('record', {
              _title: results.user.username + ' Record',
              _user:results.user,
              _record_tables: [
                {
                  title: "Memory Title",
                },
                {
                  title: "Code Guide",
                },
                {
                  title: "Code Experience",
                },
                {
                  title: "Content System",
                },
                {
                  title: "Computer Science"
                },
                {
                  title: "Network System"
                },
                {
                  title: "Framework"
                }
              ],
              _records:results.record,
            })
        })
}

exports.user_profile = (req, res)=>{
    if(!req.isAuthenticated()){
        res.redirect('/user/login')
    };
    async.parallel({
        user: function(callback){
            userModel.findById(req.user._id).exec(callback);
        },
        records: function(callback){
            recordModel.countDocuments({'user': req.user._id}).exec(callback)
        }
    },
        function(err, results){
            const messages = req.flash();
            if(err){throw err};
             res.render('profile', {
              _title: 'Your profile',
              _user: results.user, 
              _messages, 
              _record_count: results.records});
        }
    )
}

exports.user_profile_post = [
    body('gender').trim().escape(),
    body('record_title').trim().escape(),

    (req, res, next) =>  {
        if(!req.isAuthenticated()){
            res.redirect('/home/profile')
        }
        var error = validationResult(req);
        if(error.isEmpty()){
        var body = req.body;
        const user = new userModel({
            _id: req.user._id,
            gender: body.gender,
            record_title:body.record
        });
        userModel.findOne({email:req.body.email_edit}).exec(function(err, result){
            if(err){throw err}
            userModel.findByIdAndUpdate(req.user._id, user, (err)=>{
                if(err){return next(err)}
                res.redirect('/home/profile');
            })
        });
    }
    else{
        res.redirect('/home/profile')
    }
}
];
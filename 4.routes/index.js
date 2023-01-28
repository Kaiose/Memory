var express = require('express');
var router = express.Router();
var home = require('../3.controllers/home');
var record = require('../3.controllers/record');

// home
router.get('/', (req, res)=>{
    if(!req.isAuthenticated()){
        res.redirect('/user/login');
    }
    res.redirect('/home')
})
router.get('/home', home.home);

// profile
router.get('/home/profile', home.user_profile);
router.post('/home/profile', home.user_profile_post);

// record
router.post('/home/create', record.create_record);
router.get('/home/create' , (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/user/login')
    }
    res.redirect('/home')
});
router.post('/home/edit', record.edit_record);
router.post('/home', record.record_delete);

module.exports = router;

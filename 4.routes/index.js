var express = require('express');
var router = express.Router();
var home = require('../3.controllers/home');

// home
router.get('/', (req, res)=>{
    if(!req.isAuthenticated()){
        res.redirect('/user/login');
    }
    res.redirect('/home')
})
router.get('/home', home.home);

// profile
// router.get('/home/profile', home.user_profile);
// router.post('/home/profile', home.user_profile_post);


module.exports = router;

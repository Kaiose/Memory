var express = require('express');
var router = express.Router();
const record = require('../3.controllers/record');

router.get('/create' , (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/user/login')
    }
    res.redirect('/home')
});

router.post('/create', record.create_record);
router.post('/edit', record.edit_record);
router.post('/remove', record.record_delete);

module.exports = router;
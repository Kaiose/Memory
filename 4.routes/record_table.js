var express = require('express');
var router = express.Router();
const record = require('../3.controllers/record');

router.post('/create', record.create_record_table);
router.get('/select', record.select_all);
router.post('/edit', record.edit_record_table);

module.exports = router;
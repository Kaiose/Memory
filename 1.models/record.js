const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var recordSchema = new Schema({
    subject: String,
    description: String,
    date: String,
    time: String,
    table: {type:Schema.Types.ObjectId, ref: 'record.table'}
});

module.exports = mongoose.model('record', recordSchema, 'record');
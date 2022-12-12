const mongoose = require('mongoose');
const { Schema } = mongoose;

var recordSchema = new Schema({
    subject: String,
    description: String,
    date: String,
    time: String,
    collection: {type:Schema.Types.ObjectId, ref: 'record_collection'}
})

module.exports = mongoose.model('record', recordSchema, 'record');
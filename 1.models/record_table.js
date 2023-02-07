const mongoose = require('mongoose');
const { Schema } = mongoose;

var recordTableSchema = new Schema ({
  title: String,
  desciption: String,
  user: { type: Schema.Types.ObjectId, ref: 'user' }
});

  module.exports = mongoose.model('record.table', recordTableSchema, 'record.table')
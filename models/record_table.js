const mongoose = require('mongoose');
const { Schema } = mongoose;

var recordTableSchema = new Schema ({
  title: String,
  desciption: String,
  user: { type: Schema.Types.ObjectId, ref: 'user' }
});

  module.exports = mongoose.model('record_table', recordTableSchema, 'record_table')
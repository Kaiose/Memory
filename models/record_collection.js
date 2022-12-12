const mongoose = require('mongoose');
const { Schema } = mongoose;

var recordCollectionSchema = new Schema(
  {
    title: String,
    desciption: String,
    user: {type: Schema.Types.ObjectId, ref: 'user'}
  });

  module.exports = mongoose.model('record_collection', recordCollectionSchema, 'record_collection')
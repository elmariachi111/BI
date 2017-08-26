const MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://localhost:27017/leika'

module.exports = MongoClient.connect(url);

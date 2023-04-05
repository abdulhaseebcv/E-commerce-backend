const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}

module.exports.connect = (done) => {
    const url = 'mongodb://127.0.0.1:27017/';
    const dbname = 'ecom';
    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
        state.db = client.db(dbname);
        done();
    }).catch((error) => done(error))
}

module.exports.get = () => state.db

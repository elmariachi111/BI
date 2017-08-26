const con = require('./db');

var restify = require('restify');

function respond(req, res, next) {

    con.then(db => {
        const col = db.collection('customers');
        col.find({'sex': 'female'}).limit(20).forEach(customer => {
            console.log(customer.lastName);
        })
        res.send(200);
        next();
    })
}


var server = restify.createServer();
server.get('/users/count', respond);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});




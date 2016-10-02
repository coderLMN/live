var express = require("express"),
    path = require('path'),
    bodyParser = require('body-parser');

//var MongoClient = require('mongodb').MongoClient
//    , ObjectID = require('mongodb').ObjectID;
var app = express();
var http = require('http').Server(app);
var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}
function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use('/static', express.static(path.join(__dirname,'public')));


//var uri = 'mongodb://localhost:27017/sd';
//if (process.env.MONGOLAB_URI) {
//    uri = process.env.MONGOLAB_URI;
//}
//var db;
//MongoClient.connect(uri, {server: {auto_reconnect: true}}, function (err, mongo) {
//    if (err) console.log(err);
//    db = mongo;
//});

app.get('/', function (req, res) {
    res.redirect('/static/client.html');
})

var io = require('socket.io')(http);

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

//
//app.get('/start', function(req,res){
//    res.sendFile('/static/host.html');
//})
//app.post('/text', function(req,res){
//    var record = req.body;
//    var size = Object.keys(record).length;
//    res.setHeader('Content-Type', 'application/json; charset="utf-8"');
//    if (record.w && size == 1) {
//        if(record.w.length > 256)
//            record.w = record.w.substring(0,256);
//        record.w = safe_tags_replace(record.w);
//        db.collection('quote').findOne({'w': record.w}, function(err, data){
//            if(data) {
//                db.collection('quote').remove({'w': record.w}, function(err, result){
//                    db.collection('quote').insert(record, function (err, result) {
//                        res.end(JSON.stringify({status: 'dup'}));
//                    });
//                });
//            }
//            else {
//                db.collection('quote').insert(record, function (err, result) {
//                    res.end(JSON.stringify({status: 'ok'}));
//                });
//            }
//        })
//
//    }
//    else {
//        res.end(JSON.stringify({status: 'fail'}));
//    }
//})
//app.get('/text', function(req, res){
//    db.collection('quote').count({}, function(err, total){
//        db.collection('quote').find({'w':{ $exists: true}}).sort({"_id":-1}).limit(500).toArray(function(err, data){
//            res.setHeader('Content-Type', 'application/json; charset="utf-8"');
//            var words = [] , count= data.length;
//            for(var i= 0; i<count; i++){
//                words[i] = data[i].w;
//            }
//            res.end(JSON.stringify(words));
//        });
//    });
//})

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
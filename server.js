/**
 * Created by Zem on 2014-10-24.
 */
/**
 * Created by Zem on 2014-10-21.
 */
/**
 * Created by Zem on 2014-10-10.
 */
// set up ========================
var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');

// configuration =================



app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.set('port', (process.env.PORT || 8080));

// start app ======================================
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});



app.get('*', function(req, res) {
    res.sendfile(__dirname +'/public/index.html');
});


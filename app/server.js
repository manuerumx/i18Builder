var express = require('express');
var morgan = require('morgan');
var hbs = require('hbs');
var path = require('path');
var fs = require('fs');

var env = require('./config/environment');
var app = express();
var accessLogStream = fs.createWriteStream(env.dirLogs, {flags: 'a'});
if (app.get('env') !== 'production'){
    app.use(morgan('dev'));
}
app.use(morgan('combined', {stream: accessLogStream}));

/**
* Setting the engine view to hbs with html extension
*/
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', __dirname + '/views');
/**
* Register partials for hbs
*/
hbs.registerPartials(__dirname + '/views/partials');
/**
* Setting the static directory
*/
app.use(express.static(__dirname + '/public'));
/**
 * Function to add Recursive Routes file from folder
 * @name recursiveRoutes
 * @function
 * @requires fs
 * @see https://nodejs.org/api/fs.html
 * @param folderName {string} Name of the directory containing the files with routes.
 */
function recursiveRoutes(folderName) {
    fs.readdirSync(folderName).forEach(function (file) {
        var fullName = path.join(folderName, file);
        var stat = fs.lstatSync(fullName);
        if (stat.isDirectory()) {
            recursiveRoutes(fullName);
        } else if (file.toLowerCase().indexOf('.js')) {
            app.use('/', require(fullName));
        }
    });
}
recursiveRoutes(__dirname + '/' + 'routes');
/**
 * Start the server on port defined by configuration
 */
app.set('port', process.env.PORT || env.port);
var server = app.listen(app.get('port'));

/**
* Process files controller.
* @module config/processFiles
* @author Manuel González <mgrivera@gmail.com>
* @version 0.0.1
*/

var fs = require('fs');
var processFileCtrl = {
    /**
    * Function returns if file exists or not, if the file exist, also returns the properties of the file
    * @function checkFile
    *
    * @see https://nodejs.org/api/fs.html#fs_fs_stat_path_callback
    * @param file {string} Route + Filename
    * @param callback {callback}
    */
   checkFile: function (file, callback) {
       fs.stat(file, function (err) {
           if (!err) {
               callback(true);
           } else {
               callback(false);
           }
       });
   },
   /**
    * Function reads a file.
    * @function getFile
    *
    * @param file {string} Route + Filename
    * @param encoded {string} File codification
    * @param callback {callback}
    */
   getFile: function(file, encoded, callback){
       processFileCtrl.checkFile(file, function(exists){
           if(!exists){
               callback(null, {
                   'status': 'Error',
                   'message': 'The file ' + file + ' doesn\'t exists.'
               });
           }else{
               fs.readFile(file, encoded, function(err,data){
                  if(err !== null){
                      callback(null, {
                          'status': 'Error',
                          'message': 'Unable to read the file',
                          'error': err
                      });
                  } else{
                      callback(data, null);
                  }
               });
           }
       });
   },
   /**
     * Function writes a file, but before check if the file exists
     * @param file {string} Route + Filename
     * @param data {string} The data to write into the file
     * @param overwrite {boolean} Overwrite the content or fails if this file exists
     * @param callback {callback}
     */
    writeFile: function (file, data, overwrite, callback) {
        var options = {
            flags: 'w',
            defaultEncoding: 'utf8',
            autoClose: true
        };
        processFileCtrl.checkFile(file, function (exists) {
            if (exists && !overwrite) {
                callback({
                    'status': 'Error',
                    'message': 'The file ' + file + ' already exists.'
                });
            } else {
                var writerStream = fs.createWriteStream(file, options);
                writerStream.write(data);
                writerStream.end();
                writerStream.on('finish', function () {
                    callback({
                        'status': 'Success',
                        'message': 'The file was successfully created/overwrited'
                    });
                });
                writerStream.on('error', function (err) {
                    callback({
                        'status': 'Error',
                        'message': 'An error occurred while trying to create the file',
                        'error': err
                    });
                });
            }
        });
    },
    /**
     * Function returns the status of the delete operation of a file.
     *
     * @function deleteFile
     *
     * @param file {string} Route + Filename
     * @param callback {callback}
     */
    deleteFile: function (file, callback) {
        fs.unlink(file, function (exception) {
            if (exception) {
                callback({
                    'status': 'Error',
                    'message': 'An error occurred while trying to create the file',
                    'error': exception
                });
            } else {
                callback({
                    'status': 'Success',
                    'message': 'The file was successfully deleted'
                });
            }
        });
    }
};

module.exports = processFileCtrl;

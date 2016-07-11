'use strict';
var chai = require('chai');
var processFiles = require('../app/config/processFiles');

var fileNot = __dirname + '/tests/fileTest.exe';
var fileOk = __dirname + '/processFiles.js';
var newFile = __dirname + '/test.txt';

var fileData = 'Hello World! Foo Bar';
describe('Process Files controller', function () {

    it('Should return file doesn\'t exists', function (done) {
        processFiles.checkFile(fileNot, function (exist) {
            chai.expect(exist).to.equal(false);
            done();
        });
    });

    it('Should return file exists', function (done) {
        processFiles.checkFile(fileOk, function (exist) {
            chai.expect(exist).to.equal(true);
            done();
        });
    });

    it('Should return an error when try to delete a file who doesn\'t exists', function (done) {
        processFiles.deleteFile(fileNot, function (response) {
            chai.expect(response.status).to.equal('Error');
            chai.expect(response.message).to.equal('An error occurred while trying to create the file');
            done();
        })
    });

    it('Should write a new File', function (done) {
        processFiles.writeFile(newFile, fileData, false, function (response) {
            chai.expect(response.status).to.equal('Success');
            chai.expect(response.message).to.equal('The file was successfully created/overwrited');
            done();
        });
    });
    it('Should read the file', function(done){
        processFiles.getFile(newFile, 'UTF-8', function(data, error){
            chai.expect(error).to.equal(null);
            chai.expect(data).to.equal(fileData);
            done();
        });
    });

    it('Should fails to write a File when already exists', function (done) {
        processFiles.writeFile(newFile, fileData, false, function (response) {
            chai.expect(response.status).to.equal('Error');
            chai.expect(response.message).to.equal('The file ' + newFile + ' already exists.');
            done();
        });
    });

    it('Should fails to write a File because stream error', function (done) {
        processFiles.writeFile('/xxx/' + newFile,  fileData, false, function (response) {
            chai.expect(response.status).to.equal('Error');
            chai.expect(response.message).to.equal('An error occurred while trying to create the file');
            done();
        });
    });

    it('Should overwrite a File when already exists', function (done) {
        fileData = 'Foo Bar Hello World';
        processFiles.writeFile(newFile, fileData, true, function (response) {
            chai.expect(response.status).to.equal('Success');
            chai.expect(response.message).to.equal('The file was successfully created/overwrited');
            done();
        });
    });

    it('Should delete a file', function (done) {
        processFiles.deleteFile(newFile, function (response) {
            chai.expect(response.status).to.equal('Success');
            chai.expect(response.message).to.equal('The file was successfully deleted');
            done();
        })
    });

    it('Should return an error when file doesn\'t exists', function(done){
        processFiles.getFile(newFile, null, function(data, error){
            chai.expect(data).to.equal(null);
            chai.expect(error.status).to.equal('Error');
            chai.expect(error.message).to.equal('The file ' + newFile + ' doesn\'t exists.');
            done();
        });
    });

    it('Should fail when read a Directory', function(done){
        processFiles.getFile(__dirname, 'UTF-8', function(data, error){
            chai.expect(data).to.equal(null);
            chai.expect(error.status).to.equal('Error');
            chai.expect(error.message).to.equal('Unable to read the file');
            done();
        });
    });
});

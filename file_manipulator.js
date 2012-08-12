var sprintf = require('sprintf').sprintf,
    DomJS = require("dom-js").DomJS,
    fs = require('fs');

var log = require('./logger').logger;
var logger = log(true, true);

exports.txtManipulation = function(file, format, variables, cb) {
   var stringFormatted = sprintf(format, variables);
   fs.appendFile(file, stringFormatted, cb);
};

exports.xmlManipulation = function(file, format, variables, cb) {
    var domjs = new DomJS();
    fs.readFile(file, 'utf-8', function(err, data) {
    if(err) { logger.error("Error reading xml file"); cb(err); return; }
    domjs.parse(data, function(err, dom) {
      if(err) { logger.error("Error parsing xml file"); cb(err); return; }
      domjs.reset();
      var stringFormatted = sprintf(format, variables);
      domjs.parse(stringFormatted, function(err, dom2) {
       if(err) { logger.error("Error parsing xml to append"); cb(err); return; }
        dom.children.push(dom2);
        fs.writeFile(file,dom.toXml(), function(err) {
          if(err) logger.error("Error writing xml manipulation " + err);
          cb(err);
        });
      });
    });
  });
};

exports.manipulate = function(o) {
  var fullPath = this.path + '\\'+o.file;
  logger.log("Writting " + fullPath);
  o.append(fullPath, o.format, {config: this.config}, function(err) {
    if(err) logger.error("Error while writting out: " + o.file + " to " + fullPath + "Error: " + err);
  });
};
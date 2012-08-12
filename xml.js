var fs = require('fs'),
    util = require('util'),
    DomJS = require("dom-js").DomJS;

var domjs = new DomJS();

fs.readFile(__dirname + '\\Support\\client_custom_db_tables.xml', 'utf-8', function(err, data) {
    domjs.parse(data, function(err, dom) {
      domjs.reset();
      domjs.parse('<?xml version="1.0" encoding="utf-8"?>\r\n  <client value="SRG">\r\n    <tables>\r\n      <table model="not_completed" />\r\n    </tables>\r\n  </client>\r\n', function(err, dom2) { 
        //console.log(util.inspect(dom,null,23));
        dom.children.push(dom2);
        dom.toXml()
      });
    });
});


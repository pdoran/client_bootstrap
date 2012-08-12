//client_custom_db_tables.xml <clients><client value='Client'><tables></tables></client>...
//deploy.internal.environment.trunk.conn.strings.txt Client,sqlserver,DB_SERVER,DB_NAME,worklenz

var fs = require('fs'),
	util = require('util'),
	_ = require('underscore'),
  config = require('./config').config,
  fm = require('./file_manipulator'),
  svn = require('./svn').svn,
  command = require('./svn').command,
  log = require('./logger').logger,
	cp = require('child_process');

console.log(util.inspect(config.structrue));
var logger = log(true, true);

var traverse = function(o) { 
	if(o.folder) {
		createFolder(pathCombine(this.path,o.name),o.folder);
	}
	if(o.file) { 
		createFile(pathCombine(this.path,o.name),o.file);
	}
	if(o.folder==null) {
		createFolder(pathCombine(this.path,o.name),null);	
	}
};

var createFolder = function(name,folder) {
	var self = {path: name};
	fs.mkdirSync(name);
	logger.log(name);
	if(folder!=null) {
		_.each(folder, traverse, self);
	}
};

var createFile = function(name,file,contents) {
	this.path = name;
	_.each(file, function(o) {
		var content = o.content ? o.content : "";
 		if(o.manipulate) { 
 			content = o.manipulate(content);
 		}

		fs.writeFile(pathCombine(this.path,o.name), content, function(err) {
    		if(err) {
        		logger.error(err);
    		} else {
	        	logger.log(pathCombine(this.path,o.name));
    		}
		}); 
		logger.log(pathCombine(this.path,o.name));
	}, this);
};


var pathCombine = function(left,right) {
	return left + "\\" + right;
};


var base = __dirname;
command("rd", ["/s","/q",pathCombine(base,config.structure[0].name)], function (data) { logger.log("stdout: " + data);}, function (data) { logger.error('stderr: ' + data); }, function(code) {
  logger.log(pathCombine(base,config.structure[0].name) + " deleted ready for a fresh start.");
  this.path = base;
  _.each(config.structure, traverse, {path: base});
});
command("rd", ["/s","/q",pathCombine(base,"Support")], function (data) { logger.log("stdout: " + data);}, function (data) { logger.error('stderr: ' + data); }, function(code) {
  logger.log(pathCombine(base,"Support") + " deleted ready for a fresh start.");
  svn('co', ['svn://dcscm01/cds/CDS/Utilities/Build Server/Support'], function (data) { logger.log("stdout: " + data);}, function (data) { logger.error('stderr: ' + data); }, function (code) {
    if(code===0) {
      config.globalConfig.dbname = config.globalConfig.client.toLowerCase();
      _.each(fileUpdates, fm.manipulate, {config: config.globalConfig, path:pathCombine(base,"Support")} );
    } else {
      logger.error("SVN Failed, cannot update support files.");
    }
  });
});

command("rd", ["/s","/q",pathCombine(base,"CC.NET")], function (data) { logger.log("stdout: " + data);}, function (data) { logger.error('stderr: ' + data); }, function(code) {
  logger.log(pathCombine(base,pathCombine(base,"CC.NET")) + " deleted ready for a fresh start.");
  svn('co', ['svn://dcscm01/pd/wl/trunk/Build Automation/CC.NET'], function (data) { logger.log("stdout: " + data);}, function (data) { logger.error('stderr: ' + data); }, function (code) {
    if(code===0) {
      this.config = config.globalConfig;
      this.config.dbinstance=config.globalConfig.dbinstance;
      this.config.dbname=config.globalConfig.client.toLowerCase();
      this.config.dbuser=config.globalConfig.dbuser;
      //_.each(fileUpdates, fm.manipulate, this);
    } else {
      logger.error("SVN Failed, cannot update support files.");
    }
  });
});










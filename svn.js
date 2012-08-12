var util = require('util');
var log = require('./logger').logger;
var logger = log(true, true);

exports.svn = function(command, args, stdout, stderr, exit) {
  var spawn = require('child_process').spawn;
  var argList = [command].concat(args);
  svn = spawn('svn', argList);

  svn.stdout.on('data', stdout);
  svn.stderr.on('data', stderr);
  svn.on('exit', exit);
};

exports.command = function(command, args, stdout, stderr, exit) {
  var exec = require('child_process').exec;
  command = command + " " + args.join(" ");
  logger.log(command);
  cmd = exec(command, function(err, sout, serr) {
    var code = 0;
    if(err) code=1; 
    stdout(sout);
    stderr(serr);
    exit(code);
  });
};
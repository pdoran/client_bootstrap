exports.logger = function(log, debug) {
return {
  log: function(data) { if(log==true) console.log(data); },
  error: function(data) { console.log(data); },
  debug: function(data) { if(debug==true) console.log(data); }
  };
};
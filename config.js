exports = function() {
  var fm = require('./file_manipulator');
  var APPENDTYPE = { TXT: fm.txtManipulation, XML: fm.xmlManipulation };
  
return 
{ 
    globalConfig : { 
    client: "Blackbaud",
    version: "5.20.0Beta20120801",
    dbinstance: "dclab03\\sqlexpress",
    dbuser: "worklenz",
    supportPath: 'svn://dcscm01/cds/CDS/Utilities/Build Server/Support'
  },
  fileUpdates : [
    {
      file: "deploy.post.client.email.txt",
      format: "\r\n%(config.client)s;clientdevelopmentservices@metier.com",
      append:APPENDTYPE.TXT,
    },
    {
      file: "deploy.internal.environment.trunk.conn.strings.txt",
      format: "\r\n%(config.client)s,sqlserver,%(config.dbinstance)s,%(config.dbname)s,%(config.dbuser)s",
      append:APPENDTYPE.TXT,
    },
    {
      file: "client_custom_db_tables.xml",
      format: '<?xml version="1.0" encoding="utf-8"?>\r\n  <client value="%(config.client)s">\r\n    <tables>\r\n      <table model="not_completed" />\r\n    </tables>\r\n  </client>\r\n',
      append:APPENDTYPE.XML,
    },
    {
      file: "deploy.wf.location.txt",
      format: "\r\n%(config.client)s,\\\\dclab02\\c$\\wf\\workflow-definitions",
      append:APPENDTYPE.TXT,
    }
  ],
  structrue : [{
    name: globalConfig.client,
    folder: [
        {
        name: "trunk",
        folder: [
            {
              name: "Database",
              folder: [{name: "Functions"},{name: "Run Once"},{name: "Seeds"}, {name: "Stored Procedures"}, {name: "Views"}]
            },
            {name: "Documentation"},
            {name: "Config"},
            {name: "Earned Value"},
            {name: "Gatekeeper Modules"},
            {name: "Mockup Reports"},
            {name: "OLAP"},
            {name: "Utilities"},
            {name: "WorkLenz Assessments"},
            {name: "WorkLenz Custom Upgrades"},
            {name: "WorkLenz Monitors"},
            {name: "WorkLenz Notifications"},
            {name: "WorkLenz Overloaded ASPX pages"},
            {name: "WorkLenz Overloaded Reports"},
            {name: "WorkLenz Overloaded Summary Dashboards"},
            {name: "WorkLenz Plug-ins"},
            {name: "WorkLenz Reports"},
            {name: "WorkLenz Summary Dashboards"},
            {name: "WorkLenz WebServices"},
            {name: "WorkLenz Workflows"}
            ],
          file: [{name: "release_excludes.txt"}, {name:"version.txt", content: '<?xml version="1.0"?><root><log>Client.1.0.0</log><wlversion>WL_Version</wlversion></root>', manipulate: function(o) {
            var str = o;					
            str = str.replace(/Client/g,globalConfig.client);
            str = str.replace(/WL_Version/g,globalConfig.version);
            
            return str;
          }}]
        },
        {
          name: "branch"
        }
      ]
  }]
};
};

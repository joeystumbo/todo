const http = require('http'); // Import Node.js core module
const fs = require('fs');
const url = require('url');
const path = require('path');

const db = require('./libs/reader.js');
const writer = require('./libs/writer.js');

// maps file extension to MIME typere
const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};

var server = http.createServer(function (req, res) {   //create web server
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext;

  if(req.url == '/'){
      res.writeHead(301, { "Location": "http://" + req.headers['host'] + '/www/index.html' });
      return res.end();
  }
  else if (req.url.startsWith('/get_all')) {
      //return all
      let db_instance = db.get_db();

      // set response header
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(db_instance));
      res.end();
      return;
  }
  else if (req.url.startsWith('/add')) {
      let params = url.parse(req.url,true).query;
      let added = false;
      //make persistence
      let current_instance = db.get_db();
      if(params.uuid){
        current_instance[params.uuid] = {"msg": params.todo};
        added = true;

        let data = [];
        for (const [key, value] of Object.entries(current_instance)) {
          //make a line with the id and the msg
          data.push([key, value.msg]);
        }

        let rows = writer.set_data(data);
      }

      // set response header
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ response: added }));
      res.end();
      return;
  }
  else if (req.url.startsWith('/remove')) { //check the URL of the current request
      //console.log(url.parse(req.url,true).query);
      let params = url.parse(req.url,true).query;
      let deleted = false;
       //make persistence
       //search the key, delete it and re write stateof the db.
      let current_instance = db.get_db();
      if(current_instance.hasOwnProperty(params.uuid)){
        delete current_instance[params.uuid];
        deleted = true;


        let data = [];
        for (const [key, value] of Object.entries(current_instance)) {
          //make a line with the id and the msg
          data.push([key, value.msg]);
        }

        let rows = writer.set_data(data);
      }

      // set response header
      res.writeHead(200, { 'Content-Type': 'application/json' }); 
      res.write(JSON.stringify({ response: deleted }));
      res.end();
      return;
  
  }

  //file streams.... -------------------------------------->
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });

});

server.listen(5000); // listen for any incoming requests

console.log('Node.js web server at port 5000 is running..\nplease visit http://127.0.0.1:5000 with your favorite browser');
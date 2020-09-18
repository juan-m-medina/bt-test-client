const http = require('http');
const fs = require('fs');
const dotenv = require('dotenv').config();
const port = process.env.PORT;

console.log(`Read configuration, port ${port}`);

const server = http.createServer((request, response) => {
  const { method, url, headers } = request;

  if (method === 'GET' && url ===  '/') {
    fs.readFile("index.html", "UTF-8", function(err, html) {
      if (err) {
        console.log('There was an error serving the file - ' + err);
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(html);
      response.end();
    });
  }
});

server.listen(port);


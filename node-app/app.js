const express = require("express");
const app = express();
const port = 3000;
var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('Go check your app on 127.0.0.1:8080!');
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

exitOnSignal("SIGINT");
exitOnSignal("SIGTERM");

function exitOnSignal(signal) {
  process.on(signal, function() {
    process.exit(1);
  });
}

server.listen(8080);


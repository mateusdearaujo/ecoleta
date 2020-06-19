const express = require("express");
const server = express();

server.use(express.static("public"));

// template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
});

// Caminhos da aplicação
// Home
server.get("/", (req, res) => {
    return res.render("index.html");
});

server.get("/create-point", (req, res) => {
    return res.render("create-point.html");
});

server.get("/search-results", (req, res) => {
    return res.render("search-results.html");
});


server.listen(3000);
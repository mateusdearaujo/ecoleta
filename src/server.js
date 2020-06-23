const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db");

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

server.get("/search", (req, res) => {
    // pegar os dados no db
    db.all(`SELECT * FROM places`, function(err, rows){
        if(err) {
            return console.log(err);
        }

        const total = rows.length;

        return res.render("search-results.html", { places: rows, total});
    })
});

server.listen(3000);
const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db");

server.use(express.static("public"));

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }));

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

    // query strings da URL
    console.log(req.query);

    return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {

    let items = req.body.items;
    let items2 = items.replace(/,/g, ", ");

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        items2
    ];

    function afterInsertData(err) {
        if(err) {
            console.log(err);
            return res.send("Erro no Cadastro");
        }
        console.log("Cadastrado com sucesso!");
        console.log(this);

        return res.render("create-point.html", { saved: true });
    }

    db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {

    const search = req.query.search;

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total:0 });
    }



    // pegar os dados no db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err) {
            return console.log(err);
        }

        const total = rows.length;

        return res.render("search-results.html", { places: rows, total});
    })
});

server.listen(3000);
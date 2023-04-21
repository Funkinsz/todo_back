const bodyParser = require("body-parser")
const express = require("express")
const mysql = require("mysql")

const app = express()
const http = require("http")
const server = http.createServer(app)

const cors = require("cors")
// const port = 8000

const connection = mysql.createConnection({
    host: "sql8.freemysqlhosting.net",
    user: "sql8613828",
    password: "VIL8nmGi3t",
    database: "sql8613828"
})

connection.connect(err => {
    if(err) throw err;
    console.log('Connecté à la BDD');
})

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
})


// REQUETES
// POST - ADDTODO
app.post('/addTodo', (req, res) => {
    // const reqJson = JSON.parse(req)

    const content = req.body.content;
    const edit = req.body.edit;
    const done = req.body.done;

    const sql = `INSERT INTO todo (content, edit, done) VALUE(?, ?, ?)`;
    const values = [content, edit, done]

    connection.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log('TODO envoyé en BDD');
        res.send(JSON.stringify(req.body))
    })
})

// GET - READ TODOLIST
app.get('/getTodos', (req, res) => {
    const sql = `SELECT * FROM todo`

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log('récupération de TODO');
        result.map((r) => (
            r.edit == "0" ? (r.edit = false) : (r.edit = true),
            r.done == "0" ? (r.done = false) : (r.done = true)
        ))
        res.send(JSON.stringify(result))
    })
})

// POST - UPDATE TODO
app.post('/modifyTodo', (req, res) => {
    console.log(req.body);
    const id = req.body.id
    const content = req.body.content
    const edit = req.body.edit
    const done = req.body.done

    const sql = `UPDATE todo SET content = "${content}", done = ${done}, edit = ${edit} WHERE id = ${id}`

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        connection.query(`SELECT * FROM todo WHERE id=${id}`, (err, result) => {
            if (err) throw err;     
            result[0].edit == 0 ? (result[0].edit = false) : (result[0].edit = true)
            result[0].done == 0 ? (result[0].done = false) : (result[0].done = true)
            res.send(result[0])
        })
    })
})

// POST - DELETE TODO
app.post('/deleteTodo', (req, res) => {
    console.log(req.body);
    const id = req.body.id

    const sql = `DELETE FROM todo WHERE id = ${id}`

    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify('Todo supprimé de la BDD'))
    })
})

//
// app.listen(port, () => {
//     console.log(`Serveur NodeJS écoutant sur le port ${port}`);
// })
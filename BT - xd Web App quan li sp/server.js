const http = require('http')
const fs = require('fs')
const qs = require('qs')
const url = require('url')
const Controller = require("./src/Controller");

const port = 8080


let app = new Controller()

let server = http.createServer((req,res) => {
    let path = url.parse(req.url).pathname

    switch (path) {
        case '/':
            app.readFileAndShow(req, res);
            break
        case '/create':
            app.createProduct(req, res)
            break
        case '/delete':
            break
        case '/update':
            break
        default:
            res.end();
    }
})

server.listen(port,() => {
    console.log(`Server is running at http://localhost:${port}`)
})
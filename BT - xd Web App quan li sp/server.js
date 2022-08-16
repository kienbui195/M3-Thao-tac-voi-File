const http = require('http')
const url = require('url')
const Controller = require("./src/Controller");
const qs = require('qs')

const port = 3000

let app = new Controller()

let server = http.createServer((req,res) => {
    let path = url.parse(req.url).pathname
    let indexJson = +qs.parse(url.parse(req.url).query).index
    switch (path) {
        case '/':
            app.readFileAndShow(req, res);
            break
        case '/add':
            app.createProduct(req, res)
            break
        case '/delete':
            app.deleteProduct(req, res, indexJson)
            break
        case '/update':
            app.updateProduct(req, res, indexJson)
            break
        default:
            res.end();
    }
})

server.listen(port,() => {
    console.log(`Server is running at http://localhost:${port}`)
})
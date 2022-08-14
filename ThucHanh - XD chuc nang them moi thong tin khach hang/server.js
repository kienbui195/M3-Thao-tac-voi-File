const http = require('http')
const fs = require('fs')
const qs = require('qs')
const port = 8080


let server = http.createServer( (req, res) => {

    if (req.method === 'GET') {
        fs.readFile('./Template/index.html','utf-8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end()
        })
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let newData = qs.parse(data).name;
            fs.writeFile('./data/data.txt', newData, err => {
                if (err) {
                    console.log('err')
                }
                res.end('Create success')
            })
        })
        req.on('error', () => {
            console.log('error')
        })
    }
})

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
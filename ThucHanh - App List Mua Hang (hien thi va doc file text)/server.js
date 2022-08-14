const fs = require('fs')
const http = require('http')
const port = 8080


let server = http.createServer((req, res) => {
    let dataFile = ''
    let html = ''
    fs.readFile('./data/data.txt', 'utf-8', (err, data) => {
        dataFile = data.split(',')
        dataFile.forEach(( item, index) => {
            html += '<tr>'
            html += `<td>${index + 1}</td>`
            html += `<td>${item}</td>`
            html += `<td><button class="btn btn-danger">Delete</button></td>`
            html += '</tr>'
        });
    })

    fs.readFile('./Template/mainPage.html', 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        data = data.replace('{list-user}', html)
        res.write(data)
        res.end()
    })
})

server.listen(port, 'localhost', () => {
    console.log(`Server is running at http://localhost:${port}`);
})


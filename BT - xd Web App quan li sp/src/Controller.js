const fs = require("fs");
const qs = require("qs");


class Controller {
    readFileAndShow = (req , res) => {
        let dataFile = ''
        let html = ''
        fs.readFile('./data.json', 'utf-8', (err, data) => {
            dataFile = JSON.parse(data)
            dataFile.forEach((item , index) => {
                html += `<tr>`
                html += `<td>${index + 1}</td>`
                html += `<td>${item.name}</td>`
                html += `<td>${item.price}</td>`
                html += `<td><a class="btn btn-danger" type="submit" href="">Delete</a><a class="btn btn-primary" 
                                type="submit" href="">Update</a></td>`
                html += `</tr>`
            })
        })

        fs.readFile('./views/index.html', 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'})
            data = data.replace('{List-Products}', html)
            res.write(data)
            res.end()
        })
    }

    createProduct(req, res) {
        fs.readFile('./data.json','utf-8' , (err, data) => {
            let dataJson = JSON.parse(data)
            if (req.method === 'GET') {
                fs.readFile('./views/createForm.html', 'utf-8' , (err, data) => {
                    res.writeHead(200, {'Content-Type' : 'text/html'})
                    res.write(data)
                    res.end();
                })
            } else {
                let data = ''
                req.on('data', chunk => {
                    data += chunk
                })
                req.on('end', () => {
                    let newData = qs.parse(data)
                    if (newData.name === '' || newData.price === '' ) {
                        fs.readFile('./views/createForm.html', 'utf-8' , (err, data) => {
                            res.writeHead(200, {'Content-Type' : 'text/html'})
                            res.write(data)
                            res.end();
                        })
                    } else {
                        let newProduct = {
                            name: newData.name,
                            price: newData.price
                        }
                        dataJson.push(newProduct)
                        fs.writeFile('./data.json', JSON.stringify(dataJson), err => {
                            if (err) {
                                console.log(`error`)
                            }
                        })
                        res.writeHead(301, {'Location' : 'http://localhost:8080/create'})
                        res.end();
                    }
                })
            }
        })
    }
}

module.exports = Controller
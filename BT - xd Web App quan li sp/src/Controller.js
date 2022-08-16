const fs = require("fs");
const qs = require("qs");
const url = require('url')

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
                html += `<td><a class="btn btn-danger" href="/delete?index=${index}">Delete</a></td>`
                html += `<td><a class="btn btn-info" href="/update?index=${index}">Update</a></td>`
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
        fs.readFile('./data.json','utf-8', (err, data) => {
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
                                throw new Error(err.message)
                            }
                        })
                        res.writeHead(301, {'Location' : '/add'})
                        res.end();
                    }
                })
            }
        })
    }

    deleteProduct(req , res, indexJson) {
        fs.readFile('./data.json', 'utf-8', (err, data) => {
            let dataJson = JSON.parse(data)
            dataJson.splice(indexJson,1)
            console.log(dataJson)
            fs.writeFile('./data.json', JSON.stringify(dataJson), err => {
                if (err) {
                    throw new Error(err.message)
                }
                res.setHeader('Cache-Control','no-store')
                res.writeHead(301, {'Location' : '/'})
                res.end();
            })

        })
    }

    updateProduct(req, res, indexJson) {

        fs.readFile('./data.json','utf-8', (err, data) => {
            let dataJson = JSON.parse(data)
            if (req.method === 'GET') {
                fs.readFile('./views/updateProduct.html', 'utf-8' , (err, data) => {
                    data = data.replace(`<input type="text" name="nameUpdate">`, `<input type="text" value="${dataJson[indexJson].name}" name="nameUpdate">`)
                    data = data.replace(`<input type="text" name="priceUpdate">`, `<input type="text" value="${dataJson[indexJson].price}" name="priceUpdate">`)
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
                    console.log(dataJson[indexJson])
                    console.log(indexJson)
                    dataJson[indexJson].name = newData.nameUpdate
                    dataJson[indexJson].price = newData.priceUpdate

                    fs.writeFile('./data.json', JSON.stringify(dataJson), err => {
                        if (err) {
                            throw new Error(err.message)
                        }
                    })
                    res.setHeader('Cache-Control' ,'non-store')
                    res.writeHead(301, {'Location' : '/'})
                    res.end();
                })
            }
        })
    }
}

module.exports = Controller
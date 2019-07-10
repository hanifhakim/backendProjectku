const conn = require('../connection/connection')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname + '/../uploads/img' )
// console.log(__dirname);

module.exports = {
    create: async(req,res)=>{
        // console.log(req.file);
        if(!req.file){
            return res.send(req.body)
        }
        
        var arrBody = Object.keys(req.body) 
        //mengubah nilai string kosong menjadi null
        arrBody.forEach(key => { 
            if(!req.body[key]) {
                req.body[key] = null
            }       
        })

        var image = req.file.filename
        var data = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            image: image
        }
        // const {name, price, description, category, stock, pieces} = req.body
        if(data !== '' && image !== ''){

            const sql = `INSERT INTO products SET ?`       
            const sql5 = `SELECT p.id, p.name, p.category, p.price, p.description, image, 
                        stock, pieces FROM products p
                        JOIN stocks s ON p.id = s.product_id`
            
            conn.query(sql, data, (err, result)=>{
                if(err) return res.send(err)

                // result.insertedid
                var product_id = result.insertId
                var data2 = {
                    stock : req.body.stock,
                    pieces : req.body.pieces,
                    product_id : product_id
                }
                    const sql4 = `INSERT INTO stocks SET ?`
                    conn.query(sql4, data2, (err, result)=>{
                        if(err) res.send(err)
                        
                        conn.query(sql5, (err, result)=>{
                                if(err) return res.send(err)
        
                                return res.send(result)
                            })
                        })
                })    
        } else {
            return res.send('error')
        }
    
    },
    read: async(req,res)=>{
        // const{cat}=req.params
        // Object.keys(req.params).forEach(key=>{
        //     if(req.params[key] == 0){
        //       delete req.params[key]
        //     }
        // })
        // if(req.params.cat == 0){
          
        //     var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
        //     JOIN stocks s ON p.id = s.product_id`

        //     conn.query(sql, (err,result)=>{
        //     if(err) return res.send(err)

        //     return res.send(result)
        // })  
           
        // } else {
            // console.log('1');
            
            var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
           
        // }
    },
    readManage: async(req,res)=>{

            var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
            JOIN stocks s ON p.id = s.product_id`

            conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readProductHome: async(req,res)=>{

            var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, COUNT(od.product_id) FROM products p
            JOIN stocks s ON p.id = s.product_id
            JOIN order_details od ON p.id = od.product_id
            GROUP BY od.product_id
            ORDER BY COUNT(od.product_id) DESC
            LIMIT 6`

            conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readNameAsc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
        JOIN stocks s ON p.id = s.product_id
        ORDER BY p.name ASC`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readNameDesc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
        JOIN stocks s ON p.id = s.product_id
        ORDER BY p.name DESC`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readDateAsc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
        JOIN stocks s ON p.id = s.product_id
        ORDER BY p.createdAt ASC`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readDateDesc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
        JOIN stocks s ON p.id = s.product_id
        ORDER BY p.createdAt DESC`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readPriceAsc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
        JOIN stocks s ON p.id = s.product_id
        ORDER BY p.price ASC`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readPriceDesc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
        JOIN stocks s ON p.id = s.product_id
        ORDER BY p.price DESC`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },

    //SORTING WITH CATEGORY PRODUCT
    readCatNameAsc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'
            ORDER BY p.name ASC`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    readCatNameDesc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'
            ORDER BY p.name DESC`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    readCatDateAsc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'
            ORDER BY p.createdAt ASC`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    readCatDateDesc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'
            ORDER BY p.createdAt DESC`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    readCatPriceAsc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'
            ORDER BY p.price ASC`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    readCatPriceDesc: async (req, res) => {
              
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces, p.createdAt FROM products p
            JOIN stocks s ON p.id = s.product_id WHERE p.category = '${req.params.cat}'
            ORDER BY p.price DESC`

            conn.query(sql, (err,result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    readOne: async(req, res) => {
        id = req.params.product_id
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
                JOIN stocks s ON p.id = s.product_id WHERE p.id = ${id}`

        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
    
            return res.send(result)
        })
    },
    readImg: (req, res)=>{
        res.sendFile(`${uploadDir}/${req.params.photo}`)
    },
    
    delete: async(req,res)=>{
        const {product_id} = req.params
        const sql = `DELETE FROM products WHERE id = ${product_id}`
        const sql2 = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock FROM products p
                JOIN stocks s ON p.id = s.product_id WHERE p.id =${product_id}`
        conn.query(sql2, (err, result) => {
            if (err) return res.send(err)

            var img = result[0].image
            fs.unlink(`${uploadDir}/${img}`, (err) => {
                if (err) return res.send(err);

                conn.query(sql, (err, result) => {
                    if (err) return res.send(err)

                    return res.send(result)
                })
            })
        })
    },
    update: (req, res) => {
       
        const { product_id } = req.params
        const { name, price, description, category, stock, pieces } = req.body
        var sql = `SELECT * FROM products WHERE id = ${product_id};`

        if (req.file === undefined) {

            conn.query(sql, (err, result) => {
                if (err) return res.send(err)

                var image = result[0].image
                var sql2 = `UPDATE products SET name ='${name}', price='${price}', description='${description}', category= '${category}',
                image='${image}' WHERE id = ${product_id};`

                conn.query(sql2, (err, result) => {
                    if (err) return res.send(err)

                    // res.send(result)
                    conn.query(sql, (err, result) => {
                        if (err) return res.send(err)

                        var product = result[0].id
                        var sql3 = `UPDATE stocks SET stock=${stock}, pieces='${pieces}' WHERE product_id=${product}`
                        conn.query(sql3, (err, result) => {
                            if (err) return res.send(err)

                            return res.send(result)
                        })
                    })
                })
            })
        } else {

            var sql2 = `UPDATE products SET name ='${name}', price='${price}', description='${description}', category= '${category}',
                image='${req.file.filename}' WHERE id = ${product_id};`
            conn.query(sql, (err, result) => {
                if (err) return res.send(err)

                var img = result[0].image
                var id = result[0].id
                fs.unlink(`${uploadDir}/${img}`, (err) => {
                    if (err) return res.send(err)

                    conn.query(sql2, (err, result) => {
                        if (err) return res.send(err)

                        const sql3 = `UPDATE stocks SET stock=${stock}, pieces='${pieces}' WHERE product_id=${id}`
                        conn.query(sql3, (err, result) => {
                            if (err) return res.send(err)

                            return res.send(result)
                        })
                    })
                })
            })
        }

    }
}
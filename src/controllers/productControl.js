const conn = require('../connection/connection')
const path = require('path')

const uploadDir = path.join(__dirname + '/../uploads/img' )
console.log(__dirname);

module.exports = {
    post: async(req,res)=>{
        console.log(req.file);
        const {name, price, description, category, stock, pieces} = req.body
        const sql = `INSERT INTO products SET name ='${name}', price='${price}', description='${description}', category= '${category}', image='${req.file.filename}';`
        // const sql2 = `SELECT * FROM products WHERE name ='${req.body.name}'`
        const sql5 = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
                    JOIN stocks s ON p.id = s.product_id`
        
        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)
            //result.insertedid
            // res.send(result)
            var product = result.insertId
                const sql4 = `INSERT INTO stocks SET product_id = ${product}, stock=${stock}, pieces='${pieces}'`
                conn.query(sql4, (err, result)=>{
                    if(err) res.send(err)
                    
                    conn.query(sql5, (err, result)=>{
                            if(err) return res.send(err)
    
                            return res.send(result)
                        })
                    })
            })    
    
    },
    read: async(req,res)=>{
        // const{username}=req.params
        var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock, pieces FROM products p
                JOIN stocks s ON p.id = s.product_id`
    
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
                JOIN stocks s ON p.id = s.product_id`
    
        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)
    
            conn.query(sql2, (err, result)=>{
                if(err) return res.send(err)
    
                return res.send(result)
            })
        })
    },
    update: (req, res) => {
        // console.log(req.file);
        // const image = req.file.filename
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
        }

    }
}
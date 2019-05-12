const router = require('express').Router()
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname + '/../uploads/img' )
console.log(__dirname);

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upImage = multer ({
    storage: imgStorage,
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, true)
    }
})
//CREATE PRODUCTS
router.post('/manageproduct/add', upImage.single('image'), async(req,res)=>{
    console.log(req.file);
    const {name, price, description, category, stock} = req.body
    const sql = `INSERT INTO products SET name ='${name}', price='${price}', description='${description}', category= '${category}';`
    const sql2 = `SELECT * FROM products WHERE name ='${req.body.name}'`
    const sql5 = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock FROM products p
                JOIN images i ON p.id = i.product_id
                JOIN stocks s ON p.id = s.product_id`
    
    conn.query(sql, (err, result)=>{
        if(err) return res.send(err)
        //result.insertedid
        conn.query(sql2, (err, result)=>{
            if(err) return res.send(err)
            
            var product = result[0].id
            const sql4 = `INSERT INTO stocks SET product_id = ${product}, stock=${stock}`
            conn.query(sql4, (err, result)=>{
                if(err) res.send(err)
                
                const sql3 =  `INSERT INTO images SET product_id = ${product}, image='${req.file.filename}'`
                conn.query(sql3, (err, result)=>{
                    if(err) return res.send(err)
 
                    conn.query(sql5, (err, result)=>{
                        if(err) return res.send(err)

                        return res.send(result)
                    })
                })
            })
        })    
    })

})
router.get('/manageproduct/list', async(req,res)=>{
    // const{username}=req.params
    var sql = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock FROM products p
            JOIN images i ON p.id = i.product_id
            JOIN stocks s ON p.id = s.product_id`

    conn.query(sql, (err,result)=>{
        if(err) return res.send(err)

        return res.send(result)
    })
})
// get img
router.get('/manageproduct/list/:photo', (req, res)=>{
    res.sendFile(`${uploadDir}/${req.params.photo}`)
})

//delete
router.delete('/manageproduct/list/delete/:product_id', async(req,res)=>{
    const {product_id} = req.params
    const sql = `DELETE FROM products WHERE id = ${product_id}`
    const sql2 = `SELECT p.id, p.name, p.category, p.price, p.description, image, stock FROM products p
            JOIN images i ON p.id = i.product_id
            JOIN stocks s ON p.id = s.product_id`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err)

        conn.query(sql2, (err, result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    })
})

module.exports = router
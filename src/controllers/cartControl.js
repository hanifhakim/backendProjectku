const conn = require('../connection/connection')
module.exports = {
    createCart: (req, res) => {
        const {user_id, product_id} = req.params
        const {qty, cls} = req.body

        const sql = `SELECT * FROM cart WHERE product_id=${product_id} && user_id=${user_id}`
        
        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            if(result.length){
                qtyOld=result[0].qty
                const sql3 = `UPDATE cart SET qty=${qtyOld + qty} WHERE product_id=${product_id}`
                
                conn.query(sql3, (err, result) => {
                    if(err) return res.send(err)
                    
                    return res.send(result)
                })
            } else {
                const sql2 = `INSERT INTO cart SET qty=${qty}, user_id=${user_id}, product_id=${product_id}, cls='${cls}'`
                conn.query(sql2, (err,result)=>{
                    if(err) return res.send(err)
        
                    return res.send(result)
                })
                
            }   

        })
            
    },
    readCart: (req, res) => {
        const {user_id} = req.params

        const sql = `SELECT p.id, p.name, p.category, p.price, p.image, c.qty, c.cls, stock FROM products p
                    JOIN cart c on p.id = c.product_id
                    JOIN users u on u.id = c.user_id 
                    JOIN stocks s on p.id = s.product_id  
                    WHERE u.id =${user_id}`

        conn.query(sql, (err, result)=>{
            if(err)return res.send(err)

            return res.send(result)
        })
    },
    readCartOnly: (req, res) => {
        const {user_id} = req.params

        const sql = `SELECT p.id, p.name, p.category, p.price, p.image, c.qty, c.cls, stock FROM products p
                    JOIN cart c on p.id = c.product_id
                    JOIN users u on u.id = c.user_id
                    JOIN stocks s on p.id = s.product_id  
                    WHERE u.id =${user_id} AND c.cls = 'Cart'`

        conn.query(sql, (err, result)=>{
            if(err)return res.send(err)

            return res.send(result)
        })
    },
    deleteCart: (req, res) => {
        const {user_id, product_id} = req.params
        const sql = `DELETE FROM cart WHERE user_id=${user_id} AND product_id=${product_id}`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    toWishlist: (req, res) => {
        const {user_id, product_id} = req.params
        const sql = `UPDATE cart SET cls ='Wishlist' WHERE user_id=${user_id} AND product_id=${product_id}`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    toCart: (req, res) => {
        const {user_id, product_id} = req.params
        const sql = `UPDATE cart SET cls ='Cart' WHERE user_id=${user_id} AND product_id=${product_id}`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    minqtyCart: (req, res) => {
        const {user_id, product_id} = req.params
        const {newQty} = req.body
        const sql = `UPDATE cart SET qty =${newQty} WHERE user_id=${user_id} AND product_id=${product_id}`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    readWishlist: (req, res) => {
        const {user_id} = req.params

        const sql = `SELECT p.id, p.name, p.category, p.price, p.image, c.qty, c.cls, stock FROM products p
                    JOIN cart c on p.id = c.product_id
                    JOIN users u on u.id = c.user_id
                    JOIN stocks s on p.id = s.product_id  
                    WHERE u.id =${user_id} AND c.cls = 'Wishlist'`

        conn.query(sql, (err, result)=>{
            if(err)return res.send(err)

            return res.send(result)
        })
    }
}
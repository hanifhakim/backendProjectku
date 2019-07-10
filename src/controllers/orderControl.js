const conn = require('../connection/connection')
const path = require('path')
const fs = require('fs')
const {sendInvoice} = require('../emails/nodemailerInvoice.js')
const uploadDir = path.join(__dirname + '/../uploads/payment' )
module.exports = {
    createOrder: (req, res) => {
        const {user_id} = req.params

        const sql = `INSERT INTO orders SET user_id=${user_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    createOrderDetails : (req, res) => {
        const {product_id} = req.params
        const {qty, order_id, oneItem} = req.body

        const sql = `INSERT INTO order_details SET order_id=${order_id}, price_item=${oneItem},
        product_id=${product_id}, order_quantity=${qty}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    createShipment : (req, res) => {
        // const {shipment_methods, shipment_address_id, insertId} = req.body
        const data = req.body
        const sql = `INSERT INTO shipment SET ?`
        conn.query(sql, data, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    createPayment: (req, res) => {
        const {payment_methods, amount, order_id} = req.body

        const sql =  `INSERT INTO payment SET payment_methods = '${payment_methods}', order_id=${order_id}, amount=${amount}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    createInvoice: (req, res) => {
        const {username, order_id} = req.params

        const sql = `SELECT o.id, u.username, u.email, pa.payment_methods, pa.amount, s.shipment_methods FROM orders o 
        JOIN users u ON u.id = o.user_id
        JOIN shipment s ON o.id = s.order_id
        JOIN payment pa ON o.id = pa.order_id
        WHERE u.username = '${username}' AND o.id=${order_id}`

        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)

            var order_id = result[0].id
            var username = result[0].username
            var payment_methods = result[0].payment_methods
            var shipment_methods = result[0].shipment_methods
            var amount = result[0].amount
            var email = result[0].email
            sendInvoice(order_id, username, payment_methods, shipment_methods, amount, email)
            return res.send(result)
        })
    },
    createPaymentImg: (req, res) => {
        const {order_id} = req.params

        const sql =  `UPDATE payment SET payment_img = '${req.file.filename}' WHERE order_id=${order_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    deletePaymentImg: (req,res) => {
        const {user_id, order_id} = req.params
        var sql = `UPDATE payment SET payment_img=NULL WHERE order_id IN (${order_id});`
        var sql2 = `SELECT * from payment WHERE order_id IN (${order_id});`

        
        conn.query(sql2, (err, result) =>{
            if(err) return res.send(err)

            var img = result[0].payment_img
            fs.unlink(`${uploadDir}/${img}`, (err) => {
                if (err) return res.send(err);

                conn.query(sql, (err,result) => {
                    if(err) return res.send(err)

                    res.send(result)
                })
            })
        })
    },
    getPaymentImg: (req, res)=>{
        res.sendFile(`${uploadDir}/${req.params.photo}`)
    },
    updateConfirmPayment: (req, res) => {
        const {order_id} = req.params

        const sql =  `UPDATE orders SET order_status = 'Paid' WHERE id=${order_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    updateCancelPayment: (req, res) => {
        const {order_id} = req.params

        const sql =  `UPDATE orders SET order_status = 'Cancelled' WHERE id=${order_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    updateConfirmShipment: (req, res) => {
        const {order_id} = req.params

        const sql =  `UPDATE orders SET order_status = 'Delivered', delivery_date = CURRENT_TIMESTAMP 
        WHERE id=${order_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    getOrderDetails: (req, res) => {
        const {order_id} = req.params
        const sql = `SELECT * FROM order_details WHERE order_id=${order_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    getStock: (req, res) => {
        const {product_id} = req.params
        const sql = `SELECT * FROM stocks WHERE product_id = ${product_id}`
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
            
            return res.send(result)
        })
    },
    updateStock: (req, res) => {
        const {product_id} = req.params
        const {qtyOrder, qtyOld} = req.body
        
            const sql3 =  `UPDATE stocks SET stock = ${qtyOld-qtyOrder} WHERE product_id = ${product_id}`
            conn.query(sql3, (err, result)=>{
                if(err) return res.send(err)

                return res.send(result)
            })
    },
    getAllOrder: (req, res) => {
        const sql = `SELECT o.id, o.order_status, o.user_id, u.username, p.id AS product_id, p.name, 
        od.order_quantity, od.price_item, pa.payment_methods, pa.amount, pa.payment_img, s.shipment_methods, 
        s.shipment_price, a.nama_depan, a.nama_belakang, a.provinsi, a.kabupaten_kota, a.kecamatan,
        a.nama_jalan, a.kodepos, a.telepon, COUNT(o.id) FROM orders o 
        JOIN users u ON u.id = o.user_id
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        JOIN shipment s ON o.id = s.order_id
        JOIN payment pa ON o.id = pa.order_id
        JOIN address a on s.shipment_address_id = a.id
        GROUP BY o.id`

        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })

    },
    getOrder: (req, res) => {
        const {user_id} = req.params

        const sql = `SELECT o.id, o.order_status, u.username, p.id AS product_id, p.name, od.order_quantity, od.price_item,
        pa.payment_methods, pa.amount, s.shipment_methods FROM orders o 
        JOIN users u ON u.id = o.user_id
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        JOIN shipment s ON o.id = s.order_id
        JOIN payment pa ON o.id = pa.order_id
        WHERE u.id = ${user_id}
        ORDER BY o.id ASC`

        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })

    },
    getAllOrderUser: (req, res) => {
        const {user_id} = req.params

        const sql = `SELECT o.id, o.order_status, o.user_id, u.username, p.id AS product_id, p.name, 
        od.order_quantity, od.price_item, pa.payment_methods, pa.amount, pa.payment_img, s.shipment_methods, 
        s.shipment_price, COUNT(o.id) FROM orders o 
        JOIN users u ON u.id = o.user_id
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        JOIN shipment s ON o.id = s.order_id
        JOIN payment pa ON o.id = pa.order_id
        WHERE u.id=${user_id} 
        GROUP BY o.id `

        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    getPayment: (req, res) => {
        const {order_id} = req.params
        
        const sql = `SELECT od.order_id, p.amount, p.payment_img, p.payment_methods FROM order_details od
        JOIN payment p ON od.order_id = p.order_id 
        WHERE p.order_id = ${order_id}`

        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })

    },
    getOrderWithId: (req, res) => {
        const {user_id, order_id} = req.params
        const sql = `SELECT o.id, o.order_status, u.username, p.name, od.order_quantity, od.price_item,
        pa.payment_methods, pa.amount, s.shipment_methods, a.nama_depan, a.nama_belakang, a.provinsi, 
        a.kabupaten_kota, a.kecamatan, a.nama_jalan, a.kodepos, a.telepon  FROM orders o 
        JOIN users u ON u.id = o.user_id
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        JOIN shipment s ON o.id = s.order_id
        JOIN payment pa ON o.id = pa.order_id
        JOIN address a on s.shipment_address_id = a.id
        WHERE u.id = ${user_id} AND o.id=${order_id}`

        conn.query(sql, (err, result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })

    },
    sortOrderStatus: (req, res) => {
        const sql = `SELECT * FROM manageOrders ORDER by order_status ASC`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    sortOrderPayment: (req, res) => {
        const sql = `SELECT * FROM manageOrders ORDER by payment_img DESC`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },sortOrderShipment: (req, res) => {
        const sql = `SELECT * FROM manageOrders ORDER by shipment_methods ASC`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },sortOrderNew: (req, res) => {
        const sql = `SELECT * FROM manageOrders ORDER by issue_date ASC`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
    sortOrderOld: (req, res) => {
        const sql = `SELECT * FROM manageOrders ORDER by issue_date DESC`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err)

            return res.send(result)
        })
    },
}


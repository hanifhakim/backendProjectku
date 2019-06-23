const conn = require('../connection/connection')
// const multer = require('multer')
// const path = require('path')

// const uploadDir = path.join(__dirname + '/../uploads' )
// console.log(__dirname);

module.exports = {
    create:  (req, res)=>{
        req.body.user_id = req.params.user_id
        var sql = `INSERT INTO address SET ?;`
        var sql2 = `SELECT * FROM address WHERE user_id IN (${req.body.user_id});`
    
        var arrBody = Object.keys(req.body) 
        //mengubah nilai string kosong menjadi null
        arrBody.forEach(key => { 
            if(!req.body[key]) {
                req.body[key] = null
            }       
        })
    
        var data = req.body
    
        conn.query(sql, data, (err, result) => {
            if(err) return res.send(err)
    
            conn.query(sql2, (err, result) => {
                if(err) return res.send(err)
    
                return res.send(result)
            })
        })
    },
    read: (req, res) => {
        const {user_id} = req.params
        // console.log(user_id);
        
        var sql = `SELECT * FROM address WHERE user_id IN (${user_id});`
    
        conn.query(sql, (err, result) => {
            if(err) return res.send(err)
    
            res.send(result)
        })
    },
    delete:  (req, res) => {
        // const {address_id} = req.body
        const {user_id, address_id} = req.params
        var sql = `DELETE FROM address WHERE user_id IN (${user_id}) AND id IN (${address_id});`
        var sql2 = `SELECT * FROM address WHERE user_id IN (${user_id})`
    
        conn.query(sql, (err, result) => {
            if(err) return res.send(err)
    
            conn.query(sql2, (err, result) => {
                if(err) return res.send(err)
    
              return res.send(result)
            })
        })
    },
    edit: (req, res) => {
        const{user_id, address_id} = req.params
        var sql = `SELECT * FROM address WHERE user_id = ${user_id};`
        var sql2 = `UPDATE address SET ? WHERE user_id = ${user_id} AND id = ${address_id}; `
        
        var arrBody = Object.keys(req.body) 
        //mengubah nilai string kosong menjadi null
        arrBody.forEach(key => {
            if(!req.body[key]) {
                req.body[key] = null
            }       
        })
    
        const data = req.body
            conn.query(sql2, data, (err, result) => {
                if(err) return res.send(err)
    
                conn.query(sql, (err, result) => {
                    if(err) return res.send(err)
    
                    return res.send(result)
                })
              
            })
        
    }
    
}
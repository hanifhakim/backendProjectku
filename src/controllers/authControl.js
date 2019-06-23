// const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const conn = require('../connection/connection')
const {sendVerify} = require('../emails/nodemailer.js')
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')

module.exports = {
    getUser: async(req,res)=>{
        const{username}=req.params
        var sql = `SELECT * FROM users where username ='${username}';`
    
        conn.query(sql, (err,result)=>{
            if(err) return res.send(err)
    
            return res.send(result)
        })
    },
    login: (req,res)=>{
        const {username, password} = req.body
        var sql = `SELECT * FROM users WHERE username = '${username}';`
     
            conn.query(sql, async (err, result) => {
                if (err) return res.send(err)
    
                if(!result[0]) return res.send("User Not Found")
    
                const user = result[0]
                const isMatch = await bcrypt.compare(password, user.password)//kiri yg diinput user, kanan yg di db
    
                if (!isMatch) return res.send('Username and password not match')
    
                if (user.verified) return res.send(result)
                return res.send("verified dulu")
                
            })
    },
    register:  async (req, res)=>{
        var sql= `INSERT INTO users SET ?;`
        // var sql2 = `SELECT * FROM users;`
        
        var arrBody = Object.keys(req.body) 
     
        //mengubah nilai string kosong menjadi null
        arrBody.forEach(key => { 
            // console.log(req.body[key]);
            if(!req.body[key]) {
                req.body[key] = null
            }       
        })
        var data = req.body
    
        if(!req.body.email || !isEmail(req.body.email)) return res.send("Email is not valid")
    
        req.body.password = await bcrypt.hash(req.body.password, 8)
    
        conn.query(sql, data, (err, result) => {
            if(err) return res.send(err)// supaya mengirim error ke postman, bukan ke node js dan memberhentikan API
            //error pada post data
            sendVerify(req.body.username, req.body.first_name, req.body.email)
            return res.send(result)
        })
    },
    verify: (req, res) => {
        const username = req.params.username
        const sql = `UPDATE users SET verified = true WHERE username = '${username}'`
        const sql2 = `SELECT * FROM users WHERE username = '${username}'`
    
        conn.query(sql, (err, result) => {
            if(err) return res.send(err.sqlMessage)
    
            conn.query(sql2, (err, result) => {
                if(err) return res.send(err.sqlMessage)
    
                res.send('<h1>Verifikasi berhasil</h1>')
            })
        })
    }
}
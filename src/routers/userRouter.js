const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const conn = require('../connection/connection')
const {sendVerify} = require('../emails/nodemailer.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


//GET USER by USERNAME
router.get('/users/:username', async(req,res)=>{
    const{username}=req.params
    var sql = `SELECT * FROM users where username ='${username}';`

    conn.query(sql, (err,result)=>{
        if(err) return res.send(err)

        return res.send(result)
    })
})

//CREATE USERS
router.post('/users', async (req, res)=>{
    var sql= `INSERT INTO users SET ?;`
    var sql2 = `SELECT * FROM users;`
    
    var arrBody = Object.keys(req.body) 
    //mengubah nilai string kosong menjadi null
    arrBody.forEach(key => {  // menghapus field yang tidak memiliki data
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
})

//VERIFY LOGIN
router.get('/verify/:username', (req, res) => {
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
})

//LOGIN
router.post('/users/login', (req,res)=>{
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
})

//DELETE
router.delete('/users/:userid', (req, res)=>{
    const {userid} = req.params
    var sql = `DELETE FROM users WHERE id IN (${userid});`
    var sql2 = `SELECT * FROM users;`

    conn.query(sql, (err, result) => {
        if(err) throw err
        conn.query(sql2, (err, result) => {
            if(err) throw err
            res.send(result)
        })
    })
})

//EDIT Profile(25/4)
router.post('/editprofile/:user_id',async (req, res) => { // Update Profile
    const{user_id} = req.params
    var arrBody = Object.keys(req.body) // ['nama', 'email', 'age']

    arrBody.forEach(key => {  // menghapus field yang tidak memiliki data
        if(!req.body[key]) {
           delete req.body[key]
        }       
    })
    if(req.body.password){
         req.body.password = await bcrypt.hash(req.body.password, 8)
    }


    //? akan update sesuai data yg ada
    const data = req.body
        var sql = `UPDATE users SET ? WHERE id=${user_id};`
        var sql2 = `SELECT * FROM users WHERE id=${user_id};`

        conn.query(sql, data, (err, result) => {
            if(err) return res.send(err)

                conn.query(sql2, data, (err, result) => {
                    if(err) return res.send(err)

                    return res.send(result)
                })
       })


})

module.exports = router
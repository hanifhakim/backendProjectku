const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const conn = require('../connection/connection')
const {sendVerify} = require('../emails/nodemailer.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname + '/../uploads/avatar' )

module.exports = {
    delete:  (req, res)=>{
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
    },
    getAva: (req, res)=>{
        res.sendFile(`${uploadDir}/${req.params.photo}`)
    },
    deleteAva: (req,res) => {
        const {user_id} = req.params
        var sql = `UPDATE users SET avatar=NULL WHERE id IN (${user_id});`
        var sql2 = `SELECT * from users WHERE id IN (${user_id});`

        conn.query(sql, (err, result) =>{
            if(err) return res.send(err)

            conn.query(sql2, (err, result) => {
                if(err) return res.send(err)

                return res.send(result)
            })
        })
    },
    edit: async (req, res) => { // Update Profile
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
        console.log(req.file);
        
            var sql = `UPDATE users SET ? WHERE id=${user_id};`
            var sql3 = `SELECT * FROM users WHERE id=${user_id};`
            
            if(req.file === undefined){
                conn.query(sql, data, (err, result) => {
                    if(err) return res.send(err)
                    
                    conn.query(sql3, (err, result) => {
                        if(err) return res.send(err)
                        
                        return res.send(result)
                    })
                })
            }
            else{
                var sql2 = `UPDATE users SET avatar='${req.file.filename}' WHERE id=${user_id};`
                
                conn.query(sql, data, (err, result) => {
                    if(err) return res.send(err)
                    
                    conn.query(sql2, (err, result) => {
                        if(err) return res.send(err)
        
                            conn.query(sql3, (err, result) => {
                                if(err) return res.send(err)
    
                                return res.send(result)
                            })
                        })
               })
        
            }
    
    }
}
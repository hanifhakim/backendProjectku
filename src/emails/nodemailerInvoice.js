const nodemailer = require('nodemailer')
//tambahan
const path = require('path')
const Handlebars = require('handlebars')
const pdf = require('html-pdf')
const fs = require('fs')

const parentPath = path.join(__dirname, '../..')
const fileDir = path.join(parentPath, '/src/uploads/invoice') // tempat file (foto, html, pdf)


const createPdf = (order_id, username, payment_methods, shipment_methods, amount, email, fnSendEmail) => {
    var source = `
    <!DOCTYPE html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
        <div class="container">
            <p class="display-4 d-flex justify-content-between border-bottom">
                <span class="text-left">Invoice</span>
                <span class="text-right">#{{invoice}}</span>
            </p>
            <img src={{imgSrc}} height="300" width="300" alt="">
            <h1>Order Details</h1>
            <p>
                Order Id    : {{order_id}} <br>
                Username    : {{username}} <br>
                Payment     : {{payment_methods}} <br>
                Shipment    : {{shipment_methods}} <br>
                Amount      : <strong>Rp. {{amount}}</strong>
            </p>
        </div>
    </body>
    </html>
    `
var data = {
    "imgSrc": 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Fish_icon.svg/1101px-Fish_icon.svg.png',
    "order_id": `${order_id}`,
    "username": `${username}`,
    "payment_methods": `${payment_methods}`,
    "shipment_methods": `${shipment_methods}`,
    "amount": `${amount.toLocaleString()}`,
    "email": `${email}`

}
    var template = Handlebars.compile(source) // compile teks html
    var result = template(data) // gabungkan object data dg template html

    fs.writeFileSync(`${fileDir}/invoice_${order_id}_${username}.html`, result) // path, template

    var htmls = fs.readFileSync(`${fileDir}/invoice_${order_id}_${username}.html`, 'utf8')

    var options = {format: 'Letter'}

    pdf.create(htmls, options).toFile(`${fileDir}/invoice_${order_id}_${username}.pdf`, (err, result) => {
        if (err) return console.log(err.message);
        
        fnSendEmail()
        console.log("PDF berhasil dibuat");
        
    })
}


const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true, // use SSL
    // auth: {
    //     user: 'hanif.hkim@gmail.com',
    //     pass: 'haniful123'
    // }
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: 'hanif.hkim@gmail.com',
        clientId: '201406442274-ao82t898fvfieje5d6u79kgtgnle0asj.apps.googleusercontent.com',
        clientSecret: 'a-70kOX0GTyMnvQh084TAn5d',
        refreshToken: '1/DZl9LRsMScLfC50KexgoYMuGIoMs_raC8s09QL4z-LEqsE7cJG0_vT0RRbc2iAUd'
    }
})

const sendInvoice = (order_id, username, payment_methods, shipment_methods, amount, email) => {
    
    const transEmail = () =>{
        const mail = {
            from: 'Haniful Hakim <hanif.hkim@gmail.com>',
            to: email,
            subject: 'Invoice',
            attachments: [{
                filename : `invoice_${order_id}_${username}.pdf`,
                path : `${fileDir}/invoice_${order_id}_${username}.pdf`,
                contentType: 'application/pdf'
            }]
        }

        transporter.sendMail(mail, (err, res)=>{
            if(err) return console.log(err);
        
            console.log('Invoice terkirim');
        })
    }
    
    createPdf(order_id, username, payment_methods, shipment_methods, amount ,email, transEmail)
}

// const sendInvoice = () => {

// }
module.exports={
    sendInvoice
}

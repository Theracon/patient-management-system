var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Patient = require("../models/patient"),
    easyinvoice = require("easyinvoice"),
    fs = require("fs"),
    path = require("path");


// SHOW(GET): SHOW FORM TO CREATE INVOICE
router.get("/admin/invoices/new", function(req, res) {
    res.render("admin/newInvoice");
});

// // CREATE(POST): CREATE AN INVOICE
// router.post("/admin/invoices", function(req, res) {
//     var investigations = [];

//     if (typeof req.body.name == "object") {
//         for (var i = 0; i < req.body.name.length; i++) {
//             var investigation = {
//                 "quantity": "1",
//                 "description": `${req.body.name[i]}`,
//                 "tax": 0,
//                 "price": req.body.price[i]
//             }

//             investigations.push(investigation);
//         }
//     } else {
//         var investigation = {
//             "quantity": "1",
//             "description": `${req.body.name}`,
//             "tax": 0,
//             "price": req.body.price
//         }

//         investigations.push(investigation);
//     }

//     // Image path
//     var imgPath = path.resolve("img", "invoice.png");

//     // Function to encode file data to base64 string
//     function base64_encode(imgPath) {
//         // Read the image
//         var png = fs.readFileSync(imgPath);
//         console.log(png);

//         // Convert binary data to base64
//         return new Buffer.from(png).toString("base64");
//     }

//     // Invoice data object
//     var data = {
//         "documentTitle": "INVESTIGATION INVOICE", //Defaults to INVOICE
//         "locale": "en-NG", //Defaults to en-US, used for number formatting (see docs)
//         "currency": "NGN", //See documentation 'Locales and Currency' for more info
//         "taxNotation": "vat", //or gst
//         "marginTop": 25,
//         "marginRight": 25,
//         "marginLeft": 25,
//         "marginBottom": 25,
//         "logo": `${base64_encode(imgPath)}`, //or base64
//         "background": "", //or base64 //img or pdf
//         "sender": {
//             "company": "Sample Hospital",
//             "address": "Sample Street 123",
//             "zip": "123 ABC",
//             "city": "Abuja",
//             "country": "Nigeria"
//         },
//         "client": {
//             "company": `${req.body.firstname} ${req.body.middlename} ${req.body.lastname}`,
//             "address": "ABC Street",
//             "zip": "456 DEF",
//             "city": "Abuja",
//             "country": "Nigeria"
//         },
//         "invoiceNumber": Math.round(Math.random() * 1000000000),
//         "invoiceDate": new Date().toLocaleDateString("en-NG"),
//         "products": [...investigations],
//         "bottomNotice": "Kindly pay the total amount indicated at an official cash point within the hospital. Thank you.",
//     };

//     // Invoice function
//     var invoicePdf = async function() {
//         // Generate invoice pdf
//         var result = await easyinvoice.createInvoice(data);

//         // Store invoice pdf locally
//         fs.writeFileSync(`./invoice/invoice${Date.now()}.pdf`, result.pdf, 'base64');
//     }

//     // Run function
//     invoicePdf();

//     // Redirect to dashboard
//     res.redirect("/admin/invoices/download");
// });

// // SHOW(GET): SHOW INVOICE DOWNLOAD TEMPLATE
// router.get("/admin/invoices/download", function(req, res) {
//     res.render("admin/downloadInvoice");
// });

module.exports = router;
const express = require('express');
const isEmpty = require("../utils/is-empty");
const PaymentController = require('../controllers/payment.controller');
const Payment = require('../models/payment.model');
var mongodb = require("mongodb");
const router = express.Router();
const authorizePrivilege = require("../middleware/authorizationMiddleware");

//GET all payment
router.get('/', authorizePrivilege("GET_ALL_PAYMENTS"), async (req, res) => {
  try {
    const allPayments = await Payment.find().sort({createdAt:'desc'}).exec();
    res.json({ status: 200, message: "All Payments", errors: false, data: allPayments });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching payments" });
  }
})

//GET all available drivers
// router.get('/available', authorizePrivilege("GET_ALL_DRIVERS"), async (req, res) => {
//   try {
//     const allDrivers = await Brand.find({ isAvailable: true }).exec();
//     // console.log(allDrivers);
//     res.json({ status: 200, message: "All available drivers", errors: false, data: allDrivers });
//   }
//   catch (err) {
//     res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching drivers" });
//   }
// })

// GET all vehicles by type
// router.get('/type/:type',/*authorizePrivilege("GET_USER_BY_ROLE"),*/ async (req, res) => {
//   // console.log(req.body.role)
//   if (mongodb.ObjectId.isValid(req.params.type)) {
//     try {
//       const allUsers = await User.find({ role: req.params.role }).populate("role").exec()
//       if (allUsers.length > 0) {
//         res.status(200).json({ status: 200, errors: false, data: allUsers, message: "All users" })
//       } else {
//         res.json({ status: 200, errors: false, data: allUsers, message: "No User Found" });
//       }
//     } catch (err) {
//       console.log(err)
//       res.status(500).json({ status: 500, errors: true, data: null, message: "Error while searching for users associated with this role" })
//     }
//   } else {
//     res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid role id" });
//   }
// })

// DELETE a Driver
// router.delete('/:id', authorizePrivilege("DELETE_BRAND"), (req, res) => {
//   if (mongodb.ObjectID.isValid(req.params.id)) {
//     Payment.deleteOne({ _id: req.params.id }, (err, brand) => {
//       if (err) throw err;
//       res.send({ status: 200, errors: false, message: "Driver deleted successfully", data: brand })
//     }).catch(err => {
//       console.log(err);
//       res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the brand" });
//     });
//   } else {
//     // console.log("ID not Found")
//     res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid brand id" });
//   }
// });


// UPDATE A Brand
// router.put('/:id', authorizePrivilege("UPDATE_BRAND"), (req, res) => {
//   if (mongodb.ObjectID.isValid(req.params.id)) {
//     const result = PaymentController.verifyUpdate(req.body);
//     if (!isEmpty(result.errors)) {
//       return res.json(res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" }))
//     }
//     Payment.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
//       if (err) {
//         return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating brand data" });
//       }
//       if (!doc)
//         return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Brand Found" });
//       else {
//         res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Brand" });
//       }
//     })
//   } else {
//     return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid Brand Id" });
//   }
// })

// ADD NEW payment
router.post("/", authorizePrivilege("ADD_NEW_PAYMENT"), (req, res) => {
  let result = PaymentController.verifyCreate(req.body);
  if (isEmpty(result.errors)) {
    result.data.createdBy = req.user._id;
    const newPayment = new Payment(result.data);
    newPayment.save().then(data => {
      res.status(200).json({ status: 200, errors: false, data, message: "Payment Added successfully" });
    }).catch(err => {
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new payment" });
    })
  }
  else {
    res.json({ status: 500, errors: result.errors, data: null, message: "Fields required" });
  }
})

module.exports = router;
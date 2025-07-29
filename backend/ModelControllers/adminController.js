const Admin=require('../Models/admin')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Booking = require('../Models/booking');
const User = require('../Models/users');
const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.find()
        res.send(admin)
    } catch (error) {
        console.log(error);
    }
}
const adminLogin = async (req, res) => {
  try {
        const { adminemail, adminpassword } = req.body
        console.log("login", req.body);


        const admin = await Admin.findOne({ adminemail })
        console.log("loginuser", admin);

        if (admin) {
            const comparePassword = await bcrypt.compare(adminpassword, admin.adminpassword)
            console.log("password", comparePassword)

            if (comparePassword) {
                const admintoken = await jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRETKEY, { expiresIn: "1d" })

                res.status(200).json({ success: true, admintoken, admin })

            }
            else {
                res.status(404).send("⚠️ Password doesn't match")
            }
        }
        else {
            res.status(404).send("⚠️ admin not found!")
        }
    } catch (error) {
        console.log(error);

    }
}
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('serviceCenter', 'name address')
      .populate('services.category', 'name')
      .populate('services.subcategory', 'name');

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};
module.exports = { getAdmin, adminLogin, getAllBookings}
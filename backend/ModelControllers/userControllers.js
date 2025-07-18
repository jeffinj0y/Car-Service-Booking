const User = require("../Models/users")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const jwtSecretKey=process.env.JWT_KEY;
const nodemailer = require('nodemailer');   

//add user
const addUser = async (req, res) => {
    try {
        console.log("post", req.body);
        const { name, email, password, phoneno } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).send("Email is already registered!")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = new User({ name, email, password: hashedPassword, phoneno })
        await userData.save()
        res.status(200).send("user added successfully!")
    } catch (error) {
        console.log(error);
    }
}
const getUser = async (req, res) => {
    try {
        const Users = await User.find()
        res.send(Users)
    } catch (error) {
        console.log(error);
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log("login", req.body);


        const user = await User.findOne({ email })
        console.log("loginuser", user);

        if (user) {
            const comparePassword = await bcrypt.compare(password, user.password)
            console.log("password", comparePassword)

            if (comparePassword) {
                const authToken = await jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1d" })

                res.status(200).json({ success: true, authToken, user })

            }
            else {
                res.status(404).send("⚠️ Password doesn't match")
            }
        }
        else {
            res.status(404).send("⚠️ User not found!")
        }
    } catch (error) {
        console.log(error);

    }
}

const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get user count" });
    }
};

//USER FORGOT PASSWORD
const userForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "1d" });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jeffinjoy2003@gmail.com',
                pass: process.env.GOOGLE_APP_PASSCODE // Replace with the App Password
            }
        });

        const mailOptions = {
            from: 'jeffinjoy2003@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/resetpassword/${user._id}/${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Failed to send email' });
            }
            res.json({ success: true, message: 'Email sent successfully' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

// USER RESET PASSSWORD
const userResetPassword = async (req, res) => {

    const { id, token } = req.params
    const { password } = req.body

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.json({ Status: "Error with token" })
        } else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    User.findByIdAndUpdate({ _id: id }, { password: hash })
                        .then(u => res.send({ Status: "Success" }))
                        .catch(err => res.send({ Status: err }))
                })
                .catch(err => res.send({ Status: err }))
        }
    })

}

module.exports = { addUser, getUser, loginUser, getUserCount,userForgotPassword, userResetPassword };
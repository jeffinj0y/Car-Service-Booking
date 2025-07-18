const express=require("express");
require('dotenv').config();
const mongoDB = require("./dbconnection/conn");
const cors=require("cors");

const userRoute=require("./Routes/userRoutes");
const adminRoute=require("./Routes/adminRoutes.js")
const serviceCenterRoute = require("./Routes/serviceCentreRoutes.js");
const serviceRoutes = require('./Routes/serviceRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');


const app=express()

const port=5002

app.use(cors({ origin: 'http://localhost:3000',credentials: true
}));
app.use(express.json())
app.use("/api/users",userRoute)
app.use("/api/admin",adminRoute)
app.use("/api/service-centers", serviceCenterRoute);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

mongoDB()
app.listen(port,()=>{
    console.log(`server listening on port, ${port}`)
    
})
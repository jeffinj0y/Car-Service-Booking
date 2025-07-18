const mongoose=require("mongoose")


const mongoDB=()=>mongoose.connect("mongodb://127.0.0.1:27017/Mainproject")
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err))

module.exports=mongoDB
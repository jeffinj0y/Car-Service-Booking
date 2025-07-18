const express=require("express")
const router=express.Router()
const UserControllers=require("../ModelControllers/userControllers")


router.post("/addUser",UserControllers.addUser )
router.get("/get",UserControllers.getUser)
router.post("/login",UserControllers.loginUser)
router.get("/Ucount", UserControllers.getUserCount);
router.post("/forgot-password",UserControllers.userForgotPassword)
router.post("/reset-password/:id/:token",UserControllers.userResetPassword)



module.exports=router
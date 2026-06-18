const express = require("express");
const router = express.Router();
const LoginActivity = require("../models/LoginActivity");
const auth = require("../middleware/auth.middleware");

router.get("/login-activity", auth, async (req,res)=>{

try{

const logs = await LoginActivity
.find({userId:req.user.id})
.sort({createdAt:-1})
.limit(10);

res.json(logs);

}catch(err){

res.status(500).json({error:"Failed to fetch activity"});

}

});

module.exports = router;
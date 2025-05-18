const express = require('express');
const router = express.Router();

router.get("/ey",function(req,res,next){
    res.send("API Working");
}

); 
module.exports =router; 
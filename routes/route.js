const express=require("express")
const users=require("../models/users")
const userdata=require("../models/userdata")
const  jwt = require('jsonwebtoken');
const bcrypt=require("bcrypt")
const route=express.Router()
const secret="sugar"
module.exports=route
route.post("/login",async(req,res)=>{
    try{
        const finduser=await users.findOne({email:req.body.email})
        if(finduser==null){
            res.status(400).json({
                status:"error",
                message:"user is not registered"
            })
        }else{
            bcrypt.compare(req.body.password, finduser.password, async function(err, result) {
                // result == true
                if(err){
                    res.status(400).json({
                        status:"error",
                        message:err
                    })
                }else{
                    if(result){
                        const data=await users.findOne({email:req.body.email})
                        //tokens generated

                        const token=jwt.sign({
                            data: data._id
                          }, secret, { expiresIn: 60 * 60 });
                        //console.log(token)
                        res.status(200).json({
                            status:"sucess",
                            message:"user is autenticated",
                            token
                        })
                    }else{
                        res.status(400).json({
                            status:"error",
                            message:"password doesnt't match"
                        })

                    }
                }
            });
        }
        
    }catch{

    }



})
route.post("/register",async(req,res)=>{
    try{
        
        const finduser=await users.findOne({email:req.body.email})
        //checking user is existed or not
        if(finduser==null){
            try{
                
                bcrypt.hash(req.body.password, 10, async function(err, hash) {
                    // Store hash in your password DB.
                    if(err){
                        res.status(400).json({
                            status:"error",
                            message:err  
                        })
                    }else{
                        console.log(req.body)
                        await users.create({email:req.body.email,password:hash})
                        console.log("inside 2try")
                        res.status(200).json({
                            status:"sucess",
                            message:"user data created"
                            
                        })
                    }
                });  

            }
            catch(e){
                console.log("hii")
                res.status(400).json({
                    status:"error",
                    message:e.message
                })
            }

        }else{
            res.status(400).json({
                status:"error",
                message:"user already registered"
            })
        }

    }
    catch(e){
        
        res.status(400).json({
            status:"error",
            message:e.message
        })

    }

})
route.get("/home",async(req,res)=>{
    //console.log(req.headers.authorization)
    try{
        jwt.verify(req.headers.authorization, secret, async function(err, decoded) {
           // console.log(decoded) // bar
            if(err){
                res.status(400).json({
                    status:"error",
                    message:"token must be provided"  
                })
            }else{
                const data=await users.findOne({_id:decoded.data})
                if(data){
                const datax=await userdata.find({id:data._id})
                //console.log(data._id)
                res.status(200).json({
                    status:"sucess",
                    data:datax
                })}
                else{
                    res.status(400).json({
                        status:"error",
                        message:"token not verified"
                    })
                }

            }
          });
        
        
    }catch(e){
        res.status(400).json({
            status:"error",
            message:e
        })
    }
})
route.post("/home",async(req,res)=>{
    try{
        jwt.verify(req.headers.authorization, secret, async function(err, decoded) {
            //console.log(decoded) // bar
            if(err){
                res.status(400).json({
                    status:"error",
                    message:err
                })
            }else{
                
                const data=await users.findOne({_id:decoded.data})
                if(data){
                await userdata.create({...req.body,id:data._id})
                //console.log(data._id)
                res.status(200).json({
                    status:"sucess",
                    message:"task added"
                })}
                else{
                    res.status(400).json({
                        status:"error",
                        message:"token not verified"
                    })
                }

            }
          });
        
        

    }catch(e){
        res.status(400).json({
            status:"error",
            message:e
        })
    }
})
route.put("/home/:id",async(req,res)=>{
    console.log("hiii")
    try{
        jwt.verify(req.headers.authorization, secret, async function(err, decoded) {
            //console.log(decoded) // bar
            if(err){
                res.status(400).json({
                    status:"error",
                    message:err
                })
            }else{
                const data=await users.findOne({_id:decoded.data})
                if(data){
                    console.log(req.body)
                await userdata.updateOne({_id:req.params.id},req.body)
                //console.log(data._id)
                res.status(200).json({
                    status:"sucess",
                    message:"updated"
                })}
                else{
                    res.status(400).json({
                        status:"error",
                        message:"token not verified"
                    })
                }
                

            }
          });
        
        

    }catch(e){
        res.status(400).json({
            status:"error",
            message:e
        })
    }
})
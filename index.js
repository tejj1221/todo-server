const express=require("express")
const mongoose=require("mongoose")
const bodyparse=require("body-parser")
const route=require("./routes/route")
const cors=require("cors")
const app=express()
app.use(bodyparse.json())
app.use(cors());
app.use("/",route)
mongoose.connect("mongodb://localhost/readlinetodoapp")  
const port=8080
app.listen(port,()=>console.log(`app is running at${port}`))  
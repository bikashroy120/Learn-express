const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const { notFound, errorHandeler } = require("./middlewarer/errorHandelere");
const app = express()
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000
const authRouters = require("./routers/auth")
const uploasRouters = require("./routers/upload") 
const path = require("path")
const placeRouters = require("./routers/place") 


app.use(cors()) 
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,"uploads")))
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(morgan('dev'))


app.use("/api/user",authRouters)
app.use("/api/upload",uploasRouters)
app.use("/api/place",placeRouters)




app.all('*', notFound)
app.use(errorHandeler)
app.listen(PORT,()=>{ 
    dbConnect() 
    console.log(`Server is running at PORT ${PORT}`)
})

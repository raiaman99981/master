//jshint esversion:6
require('dotenv').config()
const express=require('express');

const bodyParser=require('body-parser');
const ejs=require('ejs')
const app=express();
const mongoose=require('mongoose')
const encrypt=require('mongoose-encryption')

app.use(express.static("public"));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://Aman:Aman2002@cluster0.ey688mg.mongodb.net/userDB");

const userSchema=new mongoose.Schema({
email:String,
password:String
})



userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields: ['password'] });

const User=new mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
    })

app.get("/register",(req,res)=>{
        res.render("register");
        })

/**app.get("/secrets",(req,res)=>{
    res.render("secrets");
    })**/

app.post("/register",(req,res)=>{
    const newUser= new User({
     email:req.body.username,
     password:req.body.password
    })
    newUser.save().then(
        ()=>{
            res.render("secrets");
        },
        (err)=>{
          if(err){
            console.log(err);
          }
        }
    )
})

app.post("/login",(req,res)=>{
    User.findOne({email:req.body.username}).then(
        (found)=>{
            console.log(found);
          if(found.password===req.body.password){
             res.render("secrets");
           }
           else{
            res.redirect("/login");
           }
        },
        (err)=>{
            console.log(err);
        }
    )
})


app.listen(3000,()=>{
    console.log("server started at port 3000");
})

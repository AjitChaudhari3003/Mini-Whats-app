const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override")

app.set("views",path.join(__dirname, "views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

main().then(()=>{console.log("Connection Successfull");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
};

//Index route
app.get("/chats",async(req,res) =>{
    let chats = await Chat.find();
    //console.log(chats);
    res.render("index.ejs",{chats});
});

//new route
app.get("/chats/new",(req,res)=>{
   res.render("new.ejs");
});

//create route
app.post("/chats",(req,res)=>{
    let{  to ,from, msg} = req.body;
    let newChat = new  Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()
    });
    newChat.save().then(() => {
        console.log('Chat saved successfully');
    }).catch(err => {
        console.error('Error saving chat:', err);
    });
    res.redirect("/chats")
});

//Edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let{id}= req.params;
     let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat})
});

//Update route
app.put("/chats/:id",async (req,res)=>{
    let{id}= req.params;
    let {msg:newmsg}  = req.body;
    let updatedchat = await Chat.findByIdAndUpdate(
        id,
        {msg:newmsg},
        {runValidators : true , new: true}
    );
    console.log(updatedchat);
    res.redirect("/chats");
});

//Destroy route
app.delete("/chats/:id",async (req,res)=>{
    let{id}= req.params;
    let deletedchat= await Chat.findByIdAndDelete(id);
    console.log(deletedchat);
    res.redirect("/chats");
});

app.get("/",(req,res)=>{
    res.send("working");
});

app.listen(8080,()=>{
    console.log("Server is listening");
});

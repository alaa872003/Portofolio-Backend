const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const contactSchema= new mongoose.Schema({
  name:String,
  email:{
    type:String,
    require:true
  },
  message:String,
},{timestamps:true});
const ContactUs = mongoose.model('contact',contactSchema);


// Add message
router.post('/',async (req,res)=>{
    try{

        const {name,email,message}= req.body;
        if(!name && !email && !message){
            return res.status(400).json({ message: "invalid Message" });
        }

        const myMessage = await ContactUs.create({name,email,message});
        res.status(201).json(myMessage);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})


// Get All Message
router.get('/',async(req,res)=>{
    try{

        const messages= await ContactUs.find();
        res.status(200).json(messages);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})


// Edit Message
router.put('/:email',async (req,res)=>{
    try{
        const { email } = req.params;

         const myMessage= await ContactUs.findOne({email});
    if(!myMessage){
        return res.status(404).json('message: "No Messages found to update"');
    }

    const{name,message}=req.body;
    if(name) myMessage.name=name;
    if(message) myMessage.message=message;
    await myMessage.save();

    res.json({ message: "Message updated successfully", myMessage });


    }catch (err){
    res.status(500).json({ error: err.message });

}})


// Delete Message

router.delete('/:email',async (req,res)=>{
      try{
    const { email } = req.params;
    const myMessage= await ContactUs.findOneAndDelete({email});
    res.json({ message: "message deleted successfully", myMessage });
}catch (err){
    res.status(500).json({ error: err.message });

}
})


module.exports=router;
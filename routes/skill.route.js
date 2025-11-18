const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const skillIcons = require('../skillIcons');



const skillSchema= new mongoose.Schema({
  name:{
    type:String,
    unique:true
  },
  percentage:Number,
  icon:String,
});
const Skill = mongoose.model('skill',skillSchema);
Skill.syncIndexes().then(_=console.log('skill indexes synced'))


// Add skill
router.post('/',async (req,res)=>{
    try{

        const {name,percentage}= req.body;
        if(!name&& !percentage){
            return res.status(400).json({ message: "Name & percentage are required" });
        }
        const icon = skillIcons[name.toLowerCase()] || null;

        const mySkill = await Skill.create({name,percentage,icon});
        res.status(201).json(mySkill);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})


// Get Skills
router.get('/',async(req,res)=>{
    try{

        const mySkill= await Skill.find();
        res.status(200).json(mySkill);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})


// Edit Skill
router.put('/:name',async (req,res)=>{
    try{
        const { name } = req.params;

         const skill= await Skill.findOne({name});
    if(!skill){
        return res.status(404).json('message: "No skill found to update"');
    }

    const{newName,percentage}=req.body;
    if(newName) skill.name=newName;
    if(percentage) skill.percentage=percentage;
    await skill.save();

    res.json({ message: "Skill updated successfully", skill });


    }catch (err){
    res.status(500).json({ error: err.message });

}})


// Delete Skill

router.delete('/:name',async (req,res)=>{
      try{
    const { name } = req.params;
    const skill= await Skill.findOneAndDelete({name});
    res.json({ message: "Skill deleted successfully", skill });
}catch (err){
    res.status(500).json({ error: err.message });

}
})


module.exports=router;

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const projectSchema= new mongoose.Schema({
  title:{
    type:String,
    require:true
  },
  description:String,
  image:String,
  liveLink:String,
  githubLink:String,
});
const Project = mongoose.model('project',projectSchema);
Project.syncIndexes().then(_=console.log('project indexes synced'))


const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploadsProjectImage')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + "_ProjectImage.jpg")
    }
});
const upload = multer({storage})

// Add Profile
router.post('/',upload.single('projectImg'),async (req,res)=>{
    try{

        const {title,description,liveLink,githubLink}= req.body;
        const myProject = await Project.create({title,description, liveLink,githubLink , image: req.file ? req.file.filename : null
});
        res.status(201).json(myProject);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})

// Get projects
router.get('/',async(req,res)=>{
    try{

        const myProject= await Project.find();
        res.status(200).json(myProject);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})


// Edit Project
router.put('/:title', upload.single('projectImg'),async(req,res)=>{
try{

    const { title } = req.params;

    const myProject= await Project.findOne({title});
    if(!myProject){
        return res.status(404).json('message: "No project found to update"');
    }

    const{newTitle,description,liveLink,githubLink}=req.body;
    if(newTitle) myProject.title=newTitle;
    if(description) myProject.description=description;
    if(liveLink) myProject.liveLink=liveLink;
    if(githubLink) myProject.githubLink=githubLink;


       if (req.file) {
     myProject.image = req.file.filename;

    }
   await myProject.save();

    res.status(200).json({
      message: "Project updated successfully",
      myProject
    });

  }catch (err){
    res.status(500).json({ error: err.message });
  }
});



// Delete Project

router.delete('/:title',async (req,res)=>{
      try{
    const { title } = req.params;
    const myProject= await Project.findOneAndDelete({title});
    res.json({ message: "project deleted successfully", myProject });
}catch (err){
    res.status(500).json({ error: err.message });

}
})

module.exports=router;

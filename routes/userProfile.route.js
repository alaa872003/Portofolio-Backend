const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');


const userProfileSchema= new mongoose.Schema({
    name:String,
    title:String,
    profileImg:String,
    headline:String,
    about:String,
    location:String,
    socialLinks: [
    {
        platform: String,  
        url: String
    }
    ]   
});
const UserProfile = mongoose.model('userProfile',userProfileSchema);

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploadsProfileImage')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + "_ProfileImage.jpg")
    }
});
const upload = multer({storage})

// Add Profile
// router.post('/',upload.single('profileImg'),async (req,res)=>{
//     try{

//         const {name,title,about,headline,location,socialLinks}= req.body;
//         const myProfile = await profileData.create({name,title,profileImg:req.file.filename,about,headline,location,socialLinks});
//         res.status(201).json(myProfile);
//     }catch (err){
//     res.status(500).json({ error: err.message });
//   }
// })

router.post('/', upload.single('profileImg'), async (req, res) => {
    try {
        let { name, title, about, headline, location, socialLinks } = req.body;

        let parsedLinks = [];
        if (socialLinks) {
            parsedLinks = JSON.parse(socialLinks);
        }

        const profile = await UserProfile.create({
            name,
            title,
            about,
            headline,
            location,
            profileImg: req.file ? req.file.filename : null,
            socialLinks: parsedLinks
        });

        res.status(201).json(profile);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get My Profile
router.get('/',async(req,res)=>{
    try{

        const profile= await UserProfile.findOne();
        res.status(200).json(profile);
    }catch (err){
    res.status(500).json({ error: err.message });
  }
})

router.put('/', upload.single('profileImg'), async (req, res) => {
    try {
        const profile = await UserProfile.findOne();
        if (!profile) {
            return res.status(404).json({ message: "No profile found to update" });
        }

        const { name, title, headline, location, socialLinks, about } = req.body;

        if (name) profile.name = name;
        if (title) profile.title = title;
        if (headline) profile.headline = headline;
        if (about) profile.about = about;
        if (location) profile.location = location;

        if (socialLinks) {
            profile.socialLinks = JSON.parse(socialLinks);
        }

        if (req.file) {
            profile.profileImg = req.file.filename;
        }

        await profile.save();

        res.status(200).json({
            message: "Profile updated successfully",
            profile
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports=router;

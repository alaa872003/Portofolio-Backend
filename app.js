const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const userProfileRoute= require('./routes/userProfile.route');
const contactRoute= require('./routes/contact.route');
const projectRoute= require('./routes/project.route');
const skillRoute= require('./routes/skill.route');
app.use(express.json());
app.use(cors(
    {
  origin: "http://localhost:4200",
}
)); 
app.use('/projectFiles', express.static(path.join(__dirname, 'uploadsProjectImage')));
app.use('/profileFiles', express.static(path.join(__dirname, 'uploadsProfileImage')));

mongoose.connect('mongodb://localhost:27017/portofolio').then(()=>{
    console.log('database connected');
    
})


app.use('/userProfile',userProfileRoute);
app.use('/contact',contactRoute);
app.use('/project',projectRoute);
app.use('/skill',skillRoute);
app.listen(port,()=>{
    console.log(`server started at port ${port}`);
    
})
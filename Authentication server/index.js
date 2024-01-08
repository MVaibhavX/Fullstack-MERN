const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors");

app.use(cors());


app.use(express.json());

const adminWare = async (req, res, next) => {
  const { username, password } = req.body;
  const isAdmin = await Admin.findOne({username, password});
  if(!isAdmin){
    return res.json({success: false, origin: "Adminwares"});
  } 
  req.userId = isAdmin._id;
  next();}


  

//DEFINE MONGOOSE SCHEMAS
const userSchema = new mongoose.Schema({
  username : String,
  password : String,
  purchasedCourses :[{type : mongoose.Schema.Types.ObjectId, ref : 'Course'}]
})

const adminSchema = new mongoose.Schema({
  username : String,
  password : String
})

const courseSchema = new mongoose.Schema({
  title : String,
  price : Number,
  userId: String,
  published : {type: Boolean, default: false}
})
//Define mongoose models 
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

//Connect moongoose
mongoose.connect("mongodb+srv://Vaibhav:vaibs0718@cluster0.r3djwmt.mongodb.net/test").then(() => console.log("mongodb connected")).catch((err) => console.log("Error in mongo connection:", err));





app.post("/signup", async(req, res) => {
  const {username, password} = req.body;
  
  const admin = await Admin.findOne({username : username});
  if(admin){
    res.status(401).json({message:"Admin aldready exist!" })
  }
  else{
    const obj = new Admin({username: username, password:password});
    await obj.save();

    res.status(201).json({message:"Admin created successfully"})

  }
});

app.post("/signin", async (req, res) => {
  const { username, password} = req.body;
  const admin = await Admin.findOne({username: username, password: password});
  if(admin){
     res.json({message: "user signed in successfully"})
  }else{ 
   res.status(201).json({ message: "sign up first" });
  }
  });


app.post("/courses", adminWare, async (req, res) => {
  const {title, price} = req.body;
  const userId = req.userId;

  if(!title && !price){
    return res.status(404);
  }

  const course = new Course({
    title, 
    price, 
    userId
  });
  await course.save();

  return res.json({success: true, courseDetails: course});

});

app.put("/courses/:CourseId",async (req, res) => {
  const { CourseId} = req.params;
  const course = await Course.findOne({_id : CourseId});
  if(course){
    Object.assign(course,req.body);
    await course.save();
    res.status(201).json({message:"Updated!"})
  }
  else{
    res.status(401).json({message:"Wrong ID"})
  }
})


app.get("/courses", async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

app.post("/user/signup", async(req, res)=>{
  const body = req.body;
  const user = { ...body, purchasedCourses:[]}


  const check = await User.findOne({username : user.username , password : user.password});

  if(check){
    res.status(401).json({message: "user aldready exist!"})
  }
  else{
    const newUser = new User({username : user.username, password : user.password})
    await newUser.save();
    
    res.json({
      success: true, 
      msg: "Done"
    })
  }
})


app.post("/user/signin", async (req, res) => {
  const { username, password } = req.body;
  const isUser =   await User.findOne({username: username, password: password});

  if(!isUser){
    res.json({status: false, msg: "signup first"})
  } else {
    res.json({
      success: true, 
      message: "successfull"
    })
  }
})

app.put("/publish/:courseId", async(req,res)=> {
  const {courseId} = req.params;
  // console.log("ID:", courseId);
  const id = courseId.toString();
  console.log("ID:", id);
  const course = await Course.findOne({_id : id}) || null;
  console.log("COURSE:", course);
  if(course){
    course.published = true
    await course.save();
    res.json({message: "published"})
  }
  else{
    res.json({msg: "Course not found"})
  }
})

app.post("/puchaseCourse/:courseId", async(req, res)=>{
  const {courseId} = req.params;
  const course = await Course.findOne({_id : courseId});
  if(!course){
    res.status(404).json({message:"Course not found"})
  }
  else{
    const {_id} = req.body;
    const user = await User.findOne({_id : _id })
    if(user){
      user.purchasedCourses.push(user)
      await user.save();
      res.json({message:"Purchased successfully!"})
    }
  }
})

app.get("/purchasedCourse/:userId", async(req, res)=>{
  const userId = req.params.userId;
  const user = await User.findOne({_id : userId});
  if(!user){
    res.json({message:"user not exist !!"})
  }
  else{
    const course = user.purchasedCourses;
    res.json({purchasedCourses : course})
  }
})


app.listen(3000);

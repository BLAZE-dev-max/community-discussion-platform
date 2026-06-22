const express=require("express")
const app=express()
const mongoose=require("mongoose")
const User=require("./model/user")
const bcrypt=require("bcrypt")
const Post = require("./model/upload");

const multer = require("multer");

app.use("/uploads", express.static("uploads"));

// Multer code goes here
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage }); 

uri="mongodb://blaze:fizztungsten@ac-a83qbyj-shard-00-00.mlx6ui6.mongodb.net:27017,ac-a83qbyj-shard-00-01.mlx6ui6.mongodb.net:27017,ac-a83qbyj-shard-00-02.mlx6ui6.mongodb.net:27017/node-tuts?ssl=true&replicaSet=atlas-10jk70-shard-0&authSource=admin&appName=Cluster0"
mongoose.connect(uri)
.then((req,res)=>{
    console.log("database connected")
})
.catch(err=>{
    console.log(err)
})

app.set("view engine","ejs")
app.listen(3000,()=>{
    console.log("server created successfully")

})
app.use(express.urlencoded({extended:true}))


app.post("/create-post", upload.single("image"), async (req, res) => {

    try {

        const newPost = new Post({
            message: req.body.message,
            image: req.file ? `/uploads/${req.file.filename}` : "",
            title: req.body.title,

        });

        await newPost.save();

        res.json({
            success: true
        });

    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
});
app.get("/posts", async (req, res) => {

    const posts = await Post.find()
        .sort({ createdAt: -1 });

    res.json(posts);
});
app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/signup",(req,res)=>{
    res.render("signup")

})
app.post("/login", async (req,res)=>{
    const {email,password}=req.body
        
    const user= await User.findOne({
        EmailAddress:email
    })
    if(!user){
        res.status(400).json({message:"user not found"})
    }
   
    
    const ismatch=await bcrypt.compare( password,
            user.password
        )
    
           
    if(ismatch){
        return res.status(200).json({message:"login successfull"})}
    if(!user){
        return res.status(400).json({message:"user not found"})
    }    
    if(! ismatch){
        return res.status(400).json({message:"incorrect password"})
    }
         

    

})
app.post("/signup",async (req,res)=>{
   try{
   
    const {fullname,email,password,confirmpassword}=req.body;
    const existeduser= await User.findOne({
        EmailAddress:email
    })
    if(existeduser){
        return res.status(400).json({
            message:"email already exist"
        })
    }
    const hashedpassword=await bcrypt.hash(password,10);
    const user= new User({
        fullname,
        EmailAddress:email,
        password:hashedpassword,
        
    });
    await user.save();
    res.status(201).json({message:"user registered successfully"})
}
    catch(err){
        res.status(500).json({error:err.message});
    }

    
   }
)
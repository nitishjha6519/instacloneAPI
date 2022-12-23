const express=require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require("multer");
const mongoose=require("mongoose")

const postsModel= require("./model/schema")
const DatauriParser=require("datauri/parser"); //for multer memoryStorage()
const parser = new DatauriParser();
const path = require("path");

//cloudinary
const cloudinary = require('cloudinary').v2;

const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));



router.get("/", async(req, res) => {

try{
    const newData= await postsModel.find()
    console.log(newData)
   res.json({
    status:"success",
    newData
   })
} catch(e){
  res.status(400).json({
            status: "Failed n finding documents",
            message: e.message
        })
}
})

//to store image in server from form data,  multer is used
const Imagestorage = multer.memoryStorage()
 const upload = multer({ storage: Imagestorage })

router.post("/newpost", upload.single("image"), async(req, res) => {

     console.log(req.body);
     console.log(req.file);

let data={}
   // convert base64 image data to string using datauri/parser 

  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);
  const filename=file64.content

//upload image to cloudinary and get url
  cloudinary.uploader.upload(filename, async(error, result) => {
    if (error) {
      res.status(500).send("error in uploading file to cloudinary"+error);
    } else {
      // result.secure_url is the URL of the uploaded file on Cloudinary
      console.log(result.secure_url);

        let Imageurl=await result.secure_url
          data={
             name: req.body.name,
             location:req.body.location,
             likes:req.body.likes,
             description:req.body.description,
              image:Imageurl
            }
             console.log(data)
             let postedData=await postsModel.create(data)
             res.json({
                status:"ok",
                postedData
             })
        }
     });


   });

//error filed in case something happens with multer
//   app.use((error, req, res, next) => {
//   console.log('This is the rejected field ->', error.field);
// });
 router.get("*", (req, res) => {
    res.status(404).send("PAGE IS NOT FOUND");
})

 module.exports=router;

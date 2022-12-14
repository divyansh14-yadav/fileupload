import express from "express";
import Auth from '../models/authM.js'
import multer from 'multer'
import *as path from 'path'
import * as url from "url"
const __dirname=url.fileURLToPath(new URL('.',import.meta.url))
const authrouter = express.Router()

//Image storage..........
const storage = multer.diskStorage({
  destination: './assets/images',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({
  storage: storage
}).single('Photo')

//post method..................
// authrouter.use('/', express.static(path.join+('assets/images')));
// authrouter.use('/post',express.static(path.join + ('assets/images')));
// authrouter.use(express.static(path.resolve('assets/images')));
authrouter.use(express.static(path.resolve('assets/images')));


authrouter.post("/post", async (req, res) => {
  upload(req, res, async (err) => {

    if (err) {
      console.log(err);
    } else {
      try {
        const { Name, Post, Description, Active } = req.body;
        const Photo = req.file

        if (!Name || !Post || !Description || !Photo) {
          res.status(400).send({ error: "please fill the fileld proper" })
        } else {

          const user = new Auth({
            Name, Post, Description, Active,
            Photo:req.file.originalname,
            filePath: req.file.path,
          });
          user.save()
          res.status(200).send(user)
        }
      }
      catch (error) {
        res.status(400).send({ error: "please try again" })
      }
    }
  })
})

//get method..................................
authrouter.get("/get/:id",async(req,res)=>{

  try{
  const _id= req.params.id
  const details= await Auth.findById(_id)

  res.status(200).send(details)
}
  catch(err)
  {
    res.status(400).send(err)
  }
})


//update details..........................................
authrouter.use('/Photo', express.static('assets/images'));
authrouter.put("/update/:id",async(req,res)=>{
  upload(req,res,async (err)=>{
    if(err)
    {
        console.log(err);
    }else{
        try {
          const { Name, Post, Description, Active} = req.body;
          const _id= req.params.id
          const Photo= req.file

          var user = await Auth.findByIdAndUpdate(_id,{
            Name, Post, Description, Active,
            Photo:{
              file: `http://localhost:3000/Photo/${req.file.filename}`,
            },
            new:true
          })
          res.status(200).send({ success: "Updated Detail....", user })
        } catch (error) {
          res.status(400).send({ error: "please try again" })
        }
      }
    })
})

//delete method ......................................
authrouter.delete("/delete/:id",async(req,res)=>{

    try{
        const _id= req.params.id

        const del= await Auth.findByIdAndDelete(_id)

        res.status(200).send({success: "deleted user data"})
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})
export default authrouter
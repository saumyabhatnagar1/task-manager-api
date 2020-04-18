const express=require('express');
const User=require('../models/user.js');
const auth=require('../middleware/auth.js')
const multer=require('multer');
const sharp=require('sharp')

const router=new express.Router();

router.post('/users',async (req,res)=>{
    const user=new User(req.body);
    // user.save().then(()=>{
    //     res.send(user);
    // }).catch((e)=>{
    //         res.status(400).send(e);
            
    // })
    try{
        await user.save();
        const token=await user.genertateoftoken();
        res.status(201).send({user,token})
    }
    catch(e)
    {
        res.status(400).send(e);
    }

})


router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await  user.genertateoftoken()
        res.status(200).send({user,token});
    }
    catch(e)
    {
        res.status(400).send(); 
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token;
        })
        await req.user.save();
        res.send()
    }
    catch(e)
    {
        res.status(500).send(e) 
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.status(200).send();
    }
    catch(e){
        res.status(500).send();
    }
})
router.get('/users/me',auth,async (req,res)=>{
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.send(e);
    // })
    res.send(req.user)
})


router.patch('/users/me',auth,async(req,res)=>{

    const updates=Object.keys(req.body);
    const allowedUpdate=['name','password','email','age'];
    const isValidOperation=updates.every((update)=>
        allowedUpdate.includes(update)
    )
    if(!isValidOperation)
    return res.status(400).send();
    
    try{
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        
        updates.forEach((update)=>{
            req.user[update]=req.body[update];
        })
        await req.user.save();
        if(!req.user)
        res.status(202).send();
        res.send(req.user);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})
router.delete('/users/me',auth,async (req,res)=>{
    try{
    //    const user= await User.findByIdAndDelete(req.user._id);
    //    if(!user)
    //    return res.status(404).send();
    
        await req.user.remove()
       res.status(202).send(req.user)
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

const upload=multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        return cb(new Error('File is not a image'))
        cb(undefined,true)
    }
    
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    // req.user.avatar=req.file.buffer;
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer;
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
module.exports=router;

router.delete('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar=undefined;
    req.user.save()
    res.send();
})

router.get('/users/:id/avatars',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send();
    }
})
const express=require('express');
const Task=require('../models/task.js');
const router=new express.Router();
const auth=require('../middleware/auth.js')
 
router.get('/tasks',auth,async (req,res)=>{
    // Task.find({}).then((tasks)=>{
    //     res.status(202).send(tasks);
    // }).catch((e)=>{
    //     res.send(e);
    // })

    const match={}
    const sort=  {}
    if(req.query.completed){
        match.completed=req.query.completed==='true';
    }

    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':');
        sort[parts[0]]=parts[1]==='desc'?-1:1; 
    }
    try{
        // const tasks=await Task.find({})
        await req.user.populate({path:'tasks',match,
    options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort,
    }}).execPopulate();
        res.send(req.user.tasks);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id;
    // Task.findById(_id).then((task)=>{
    //     if(!task)
    //     return res.status(404);
    //     res.status(202).send(task);
    // }).catch((e)=>{
    //     res.send(e);    
    // })
    try{
        // const task=await Task.findById(_id);
        const task=await Task.findOne({_id,owner:req.users._id})
        if(!task)
        res.status(202).send();
        res.send(task);
    }
    catch(e)
    {
        res.status(404).send(e);
    }

})
router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates=Object.keys(req.body);
    const taskAllowedUpdate=['description','completed'];
    const isValidOperation=updates.every((update)=>
        taskAllowedUpdate.includes(update)
    )
    if(!isValidOperation)
    return res.status(400).send();

    const task=await Task.findOne({_id:req.params._id,owner:req.user._id})
    // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  
   
    if(!task)
     res.status(404).send();
    res.status(202).send(task)

    updates.forEach((update)=>{
        task[update]=req.body[update];
    })
    await task.save();

})


router.post('/tasks',auth,async(req,res)=>{
    // const tasks=new Task(req.body);

    const task=new Task({...req.body,
    owner:req.user._id
    })
    try{
        await task.save();
        res.send(task);
    }
    catch(e)
    {
        res.status(400).send(e);
    }

})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{

        const task=await Task.findOneAndDelete({_id:req.params._id,owner:req.user._id});
        if(!task)
        return res.status(202).send();
        res.send(task);
    }catch(e)
    {
        res.status(400).send(e);
    }
})

module.exports=router;
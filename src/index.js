const express=require('express');
const app=express();
const port=process.env.PORT||3000;
require('./db/mongoose.js');
const User=require('./models/user.js');
const Task=require('./models/task.js');
const newRouteUser=require('./routers/users.js');
const newRouteTask=require('./routers/tasks.js');


// app.use((req,res,next)=>{

//     if(req.method==='GET')
//     {
//         res.send('get requests are disable')
//     }
//     else{
//         next();
//     }
// })
// app.use((req,res,next)=>{
//     res.status(503).send('SIte is cuurently down try after sometime')
// })

app.use(express.json());
app.use(newRouteUser);
app.use(newRouteTask);


app.listen(port,()=>{
    console.log('Server is running')});








// const bcrypt=require('bcryptjs');
// const myfun=async ()=>{
// const password='ssasb2000';
// const hashedPasswor=await bcrypt.hash(password,8);
// console.log(password);
// console.log(hashedPasswor);
// const isMatch=await bcrypt.compare('ssasb2000=',hashedPasswor);
// console.log(isMatch)
// }
// myfun();

// const jwt=require('jsonwebtoken');
// const myfun=async ()=>{
//     const token=jwt.sign({_id:'abc123'},'anysentence',{expiresIn:'7 days'});
//     console.log(token);
//     const data=jwt.verify(token,'anysentence')
//     console.log(data)
// }
// myfun();


const multer=require('multer');
const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000 //1mb
    },
    fileFilter(req,file,cb){
    

        if(!file.originalname.match(/\.(doc|docx)$/))
        {
            return cb(new Error('Please upload a pdf'))
        }
        cb(undefined,true)
    }
})


// app.post('/uploads',upload.single('upload'),(req,res)=>{
//     res.send();

// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })
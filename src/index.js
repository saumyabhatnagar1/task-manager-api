const express=require('express');
const app=express();
const port=process.env.PORT;
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
    console.log('Server is running',+port)});









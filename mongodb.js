const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
const objectId=mongodb.ObjectID;
const connectionURL='mongodb://127.0.0.1:27017';
const databaseName='task_manager';




MongoClient.connect(connectionURL,{useNewUrlParser:true,useUnifiedTopology:true},(error,client)=>{
    if (error)
        return console.log('Unable to connect to database');
    const db= client.db(databaseName);
    //  db.collection('users').findOne({name:'Saumya'},(error,user)=>{
    //      if(error)
    //      return console.log(error);
         
    //      console.log(user);

    //  })
    //  db.collection('users').find({age:25}).toArray((error,user)=>{
    //      if (error)
    //      return console.log(error);
    //      return console.log(user);
    //  })
    //  db.collection('tasks').findOne({_id:new objectId("5e1dd078573e4011e4ff0f61"),},(error,user)=>{
    //      if(error)
    //      return console.log(error);
    //     return console.log(user);
    //  })
    //  db.collection('tasks').find({completed:false}).toArray((error,user)=>{
    //      if(error)
    //      return console.log(error);
    //      return console.log(user);
    //  })
    //  db.collection('users').updateOne({_id:new objectId("5e1dcb1212003115406ec047")},{
    //      $set:{
    //          name:'Prajjwal',
    //      }
    //  }).then((result)=>{console.log(result)}).catch((error)=>{console.log(error)});
    //  db.collection('users').updateOne({name:'swayam'},{
    //      $inc:{
    //          age:1,
    //      }
    //  }).then((result)=>{console.log(result)}).catch((error)=>console.log(error));
    //  db.collection('tasks').updateMany({completed :false},{
    //      $set:{
    //          completed:true
    //      }
    //  }).then((result)=>{console.log(result)}).catch((error)=>{console.log(error)});

    db.collection('users').deleteMany({age:24})
    .then((result)=>{console.log(result)}).catch((error)=>{console.log(error)});
    db.collection('tasks').deleteOne({description:'Buy fruits'})
    .then((result)=>{console.log(result)})
    .catch((error)=>{console.log(error)})
})
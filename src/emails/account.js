const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail=(email,name)=>{
    const msg={
        to:email,
        from:'bhatnagar.saumya2000@gmail.com',
        subject:'Thanks for joining in',
        text:`Welcome to the app,${name}. Let me know if you have any query`
    }
    sgMail
    .send(msg)
    .then(() => {}, error => {
      console.error(error);
   
      if (error.response) {
        console.error(error.response.body)
      }
});


}
const sendCancelEmail=(email,name)=>{
    const msg={
        to:email,
        from:'bhatnagar.saumya2000@gmail.com',
        subject:'We will miss you',
        text:`Thanks for using Task Manager Api,${name}. Regards Saumya.`
    }
    sgMail.send(msg).then((res)=>{
        
    }).catch((err)=>{
        console.log(error.response.body)
    })
}
module.exports={
    sendCancelEmail,
    sendWelcomeEmail,


}
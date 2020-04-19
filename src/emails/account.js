const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');


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
module.exports={
    sendWelcomeEmail,

}